import type { UnitType } from '../api/types'
import { useLang, type StringKey } from '../i18n'
import { formatMoney } from '../lib/format'

// Proposed rents (docs/PRODUCT.md). Static on purpose: the contract has no rent endpoint.
export const UNIT_ORDER: UnitType[] = ['studio', 'one_bedroom', 'two_bedroom', 'three_bedroom']
export const RENTS: Record<UnitType, number> = {
  studio: 800,
  one_bedroom: 1000,
  two_bedroom: 1250,
  three_bedroom: 1500,
}
const CLAREMONT_MEDIAN_RENT = 2237

/** Plain HTML table, read like a fare chart. */
export function RentTable() {
  const { t, lang } = useLang()
  return (
    <div className="rent">
      <table className="rent__table">
        <caption>{t('apply.rent.caption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('rent.col.home')}</th>
            <th scope="col" className="rent__num">
              {t('rent.col.rent')}
            </th>
          </tr>
        </thead>
        <tbody>
          {UNIT_ORDER.map((u) => (
            <tr key={u}>
              <th scope="row">{t(`unit.${u}` as StringKey)}</th>
              <td className="rent__num">
                {formatMoney(RENTS[u], lang)}
                <span className="rent__per">/{t('rent.mo')}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{t('apply.rent.includes')}</p>
      <p className="rent__compare">{t('apply.rent.compare', { median: formatMoney(CLAREMONT_MEDIAN_RENT, lang) })}</p>
    </div>
  )
}
