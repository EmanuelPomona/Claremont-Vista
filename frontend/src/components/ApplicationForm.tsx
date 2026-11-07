import { useState, type FormEvent } from 'react'
import { ApiError, submitApplication } from '../api/client'
import type { ApplicationResponse, Employer, JobCategory, UnitType } from '../api/types'
import { useLang, type Lang, type StringKey } from '../i18n'
import { UNIT_ORDER } from './RentTable'

const EMPLOYERS: Employer[] = ['pomona', 'cmc', 'scripps', 'pitzer', 'hmc', 'cgu', 'kgi', 'tcc', 'other']
const JOBS: JobCategory[] = ['dining', 'grounds', 'custodial', 'maintenance', 'admin', 'other']

type FieldName =
  | 'full_name'
  | 'email'
  | 'phone'
  | 'employer'
  | 'job_category'
  | 'household_size'
  | 'annual_income'
  | 'unit_type'
type Errors = Partial<Record<FieldName, StringKey>>

// top-to-bottom, so we can focus the first invalid field
const FIELD_ORDER: FieldName[] = [
  'full_name',
  'email',
  'phone',
  'employer',
  'job_category',
  'household_size',
  'annual_income',
  'unit_type',
]

const FIELD_ERROR: Record<FieldName, StringKey> = {
  full_name: 'err.name',
  email: 'err.email',
  phone: 'err.phone',
  employer: 'err.employer',
  job_category: 'err.job',
  household_size: 'err.household',
  annual_income: 'err.income',
  unit_type: 'err.unit',
}

interface Values {
  full_name: string
  email: string
  phone: string
  employer: '' | Employer
  job_category: '' | JobCategory
  household_size: string
  annual_income: string
  unit_type: '' | UnitType
  preferred_language: Lang
  needs_accessible_unit: boolean
}

/** "52,000", "$52,000" or "52000" become 52000. Anything else is null. */
export function parseIncome(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, '')
  const m = cleaned.match(/^(\d+)(\.\d+)?$/)
  if (!m) return null
  const n = parseInt(m[1], 10)
  return n <= 1_000_000 ? n : null
}

function validate(v: Values): Errors {
  const errs: Errors = {}
  const email = v.email.trim()
  const phone = v.phone.trim()
  if (!v.full_name.trim()) errs.full_name = 'err.name'
  if (!email && !phone) errs.email = 'err.contact'
  else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'err.email'
  if (phone && !/^[0-9 +()-]{7,20}$/.test(phone)) errs.phone = 'err.phone'
  if (!v.employer) errs.employer = 'err.employer'
  if (!v.job_category) errs.job_category = 'err.job'
  const size = Number(v.household_size)
  if (!Number.isInteger(size) || size < 1 || size > 8) errs.household_size = 'err.household'
  if (parseIncome(v.annual_income) === null) errs.annual_income = 'err.income'
  if (!v.unit_type) errs.unit_type = 'err.unit'
  return errs
}

interface Props {
  onResult: (result: ApplicationResponse, householdSize: number) => void
}

export function ApplicationForm({ onResult }: Props) {
  const { t, lang } = useLang()
  const [values, setValues] = useState<Values>({
    full_name: '',
    email: '',
    phone: '',
    employer: '',
    job_category: '',
    household_size: '',
    annual_income: '',
    unit_type: '',
    preferred_language: lang,
    needs_accessible_unit: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }))
    // the contact error lives on email but is cleared by phone too
    if (key === 'phone' && errors.email === 'err.contact') setErrors((e) => ({ ...e, email: undefined }))
  }

  const focusField = (name: FieldName) => document.getElementById(`app-${name}`)?.focus()

  const aria = (name: FieldName, hint = false) => ({
    id: `app-${name}`,
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': [hint ? `app-${name}-hint` : null, errors[name] ? `app-${name}-err` : null].filter(Boolean).join(' ') || undefined,
  })

  const fieldError = (name: FieldName) =>
    errors[name] ? (
      <p className="field__error" id={`app-${name}-err`}>
        {t(errors[name]!)}
      </p>
    ) : null

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    setServerError(false)
    const errs = validate(values)
    setErrors(errs)
    const first = FIELD_ORDER.find((f) => errs[f])
    if (first) {
      focusField(first) // inline errors, and no network call
      return
    }

    setSubmitting(true)
    try {
      const size = Number(values.household_size)
      const result = await submitApplication({
        full_name: values.full_name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        employer: values.employer as Employer,
        job_category: values.job_category as JobCategory,
        household_size: size,
        annual_income: parseIncome(values.annual_income)!,
        unit_type: values.unit_type as UnitType,
        preferred_language: values.preferred_language,
        needs_accessible_unit: values.needs_accessible_unit,
      })
      onResult(result, size)
    } catch (err) {
      const field = err instanceof ApiError ? (err.field as FieldName | undefined) : undefined
      if (err instanceof ApiError && err.status === 400 && field && FIELD_ORDER.includes(field)) {
        // a server 400 lands on its own input
        setErrors({ [field]: err.error === 'contact_required' ? 'err.contact' : FIELD_ERROR[field] })
        focusField(field)
      } else {
        setServerError(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const hasErrors = FIELD_ORDER.some((f) => errors[f])

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="app-full_name">{t('apply.name')}</label>
        <input
          {...aria('full_name')}
          type="text"
          autoComplete="name"
          maxLength={100}
          value={values.full_name}
          onChange={(e) => set('full_name', e.target.value)}
        />
        {fieldError('full_name')}
      </div>

      <div className="form__pair">
        <div className="field">
          <label htmlFor="app-email">{t('apply.email')}</label>
          <input
            {...aria('email', true)}
            type="email"
            autoComplete="email"
            maxLength={200}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
          {fieldError('email')}
        </div>
        <div className="field">
          <label htmlFor="app-phone">{t('apply.phone')}</label>
          <input
            {...aria('phone')}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
          {fieldError('phone')}
        </div>
      </div>
      <p className="field__hint form__contact-hint" id="app-email-hint">
        {t('apply.contact.hint')}
      </p>

      <div className="form__pair">
        <div className="field">
          <label htmlFor="app-employer">{t('apply.employer')}</label>
          <select
            {...aria('employer')}
            value={values.employer}
            onChange={(e) => set('employer', e.target.value as Employer)}
          >
            <option value="">{t('apply.select')}</option>
            {EMPLOYERS.map((o) => (
              <option key={o} value={o}>
                {t(`employer.${o}` as StringKey)}
              </option>
            ))}
          </select>
          {fieldError('employer')}
        </div>
        <div className="field">
          <label htmlFor="app-job_category">{t('apply.job')}</label>
          <select
            {...aria('job_category')}
            value={values.job_category}
            onChange={(e) => set('job_category', e.target.value as JobCategory)}
          >
            <option value="">{t('apply.select')}</option>
            {JOBS.map((o) => (
              <option key={o} value={o}>
                {t(`job.${o}` as StringKey)}
              </option>
            ))}
          </select>
          {fieldError('job_category')}
        </div>
      </div>

      <div className="form__pair">
        <div className="field">
          <label htmlFor="app-household_size">{t('apply.household')}</label>
          <select
            {...aria('household_size')}
            value={values.household_size}
            onChange={(e) => set('household_size', e.target.value)}
          >
            <option value="">{t('apply.select')}</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {fieldError('household_size')}
        </div>
        <div className="field">
          <label htmlFor="app-annual_income">{t('apply.income')}</label>
          <input
            {...aria('annual_income', true)}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={values.annual_income}
            onChange={(e) => set('annual_income', e.target.value)}
          />
          <p className="field__hint" id="app-annual_income-hint">
            {t('apply.income.hint')}
          </p>
          {fieldError('annual_income')}
        </div>
      </div>

      <div className="field">
        <label htmlFor="app-unit_type">{t('apply.unit')}</label>
        <select
          {...aria('unit_type')}
          value={values.unit_type}
          onChange={(e) => set('unit_type', e.target.value as UnitType)}
        >
          <option value="">{t('apply.select')}</option>
          {UNIT_ORDER.map((u) => (
            <option key={u} value={u}>
              {t(`unit.${u}` as StringKey)}
            </option>
          ))}
        </select>
        {fieldError('unit_type')}
      </div>

      <fieldset className="choice">
        <legend>{t('apply.lang')}</legend>
        {(['en', 'es'] as Lang[]).map((code) => (
          <label key={code} className="choice__option">
            <input
              type="radio"
              name="preferred_language"
              value={code}
              checked={values.preferred_language === code}
              onChange={() => set('preferred_language', code)}
            />
            <span lang={code}>{t(code === 'en' ? 'lang.en' : 'lang.es')}</span>
          </label>
        ))}
      </fieldset>

      <label className="choice__option form__check">
        <input
          type="checkbox"
          checked={values.needs_accessible_unit}
          onChange={(e) => set('needs_accessible_unit', e.target.checked)}
        />
        <span>{t('apply.accessible')}</span>
      </label>

      {(hasErrors || serverError) && (
        <p className="form__alert" role="alert">
          {serverError ? t('err.server') : t('apply.errors')}
        </p>
      )}

      <button type="submit" className="btn form__submit" disabled={submitting} aria-busy={submitting}>
        {submitting ? t('apply.submitting') : t('apply.submit')}
      </button>
    </form>
  )
}
