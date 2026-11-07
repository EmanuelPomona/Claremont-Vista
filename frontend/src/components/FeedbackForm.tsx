import { useRef, useState, type FormEvent } from 'react'
import { submitFeedback } from '../api/client'
import { useLang } from '../i18n'

const MAX = 1000
const RATINGS = [1, 2, 3, 4, 5]

/** Anonymous site feedback (the rubric's Test stage). On failure the note is kept. */
export function FeedbackForm() {
  const { t, lang } = useLang()
  const [rating, setRating] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'done'>('idle')
  const [ratingError, setRatingError] = useState(false)
  const firstRadio = useRef<HTMLInputElement>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    if (rating === null) {
      setRatingError(true)
      firstRadio.current?.focus()
      return
    }
    setStatus('sending')
    try {
      await submitFeedback({ rating, message: message.trim() || null, page: 'contact', language: lang })
      setStatus('done')
    } catch {
      setStatus('error') // rating and message stay as typed
    }
  }

  function reset() {
    setRating(null)
    setMessage('')
    setRatingError(false)
    setStatus('idle')
  }

  if (status === 'done') {
    return (
      <div className="feedback feedback--done" role="status">
        <p className="feedback__thanks">{t('feedback.success')}</p>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          {t('feedback.another')}
        </button>
      </div>
    )
  }

  const sending = status === 'sending'
  return (
    <form className="feedback" onSubmit={onSubmit} noValidate>
      <fieldset className="feedback__rating" aria-describedby={ratingError ? 'rating-err' : undefined}>
        <legend>{t('feedback.legend')}</legend>
        <div className="rating">
          {RATINGS.map((n, i) => (
            <label key={n} className="rating__option">
              <input
                ref={i === 0 ? firstRadio : undefined}
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                required
                aria-invalid={ratingError}
                onChange={() => {
                  setRating(n)
                  setRatingError(false)
                }}
              />
              <span>{n}</span>
            </label>
          ))}
        </div>
        <p className="rating__scale" aria-hidden="true">
          <span>{t('feedback.low')}</span>
          <span>{t('feedback.high')}</span>
        </p>
        {ratingError && (
          <p className="field__error" id="rating-err" role="alert">
            {t('feedback.rating.required')}
          </p>
        )}
      </fieldset>

      <div className="field">
        <label htmlFor="fb-message">{t('feedback.message')}</label>
        <textarea
          id="fb-message"
          rows={4}
          maxLength={MAX}
          value={message}
          aria-describedby="fb-count"
          onChange={(e) => setMessage(e.target.value)}
        />
        <p className="field__hint" id="fb-count">
          {t('feedback.count', { n: message.length })}
        </p>
      </div>

      {status === 'error' && (
        <p className="field__error" role="alert">
          {t('feedback.error')}
        </p>
      )}

      <button type="submit" className="btn" disabled={sending} aria-busy={sending}>
        {sending ? t('feedback.sending') : status === 'error' ? t('state.retry') : t('feedback.submit')}
      </button>
    </form>
  )
}
