import { type AdviceResult, type AdviceStatus, type TargetAction } from '../types/index.ts'
import { STAT_NAMES } from '../types/stats.ts'
import { PANEL } from './styles.ts'

/** Props for the advice panel. */
interface AdvicePanelProps {
  /** The advice computed from the current state. */
  result: AdviceResult
}

/** Headline label and colour for each status. */
const STATUS_DISPLAY: Record<AdviceStatus, { label: string; className: string }> = {
  guaranteed: { label: '已成定局', className: 'text-green-bright' },
  viable: { label: '可行', className: 'text-cream' },
  unlikely: { label: '希望渺茫', className: 'text-gold' },
  doomed: { label: '无望', className: 'text-red-bright' },
}

/** Colour for each per-target action. */
const ACTION_CLASS: Record<TargetAction, string> = {
  'lock-now': 'text-green-bright',
  hold: 'text-gold',
  'wait-window': 'text-muted',
  done: 'text-muted',
}

/** The Advice card: headline status, the recommendation, the per-target checklist. */
export function AdvicePanel({ result }: AdvicePanelProps) {
  const status = STATUS_DISPLAY[result.status]

  return (
    <section className={`${PANEL} p-4`} aria-labelledby="advice-heading">
      <h2 id="advice-heading" className="font-display text-lg text-gold">
        建议
      </h2>
      <p className={`mt-3 font-display text-lg ${status.className}`}>{status.label}</p>
      <p className="mt-1 text-sm text-cream">{result.headline}</p>

      {result.targetAdvice.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1">
          {result.targetAdvice.map((target) => (
            <li key={target.index} className="flex justify-between gap-2 text-sm">
              <span className="text-cream">{STAT_NAMES[target.index]}</span>
              <span className={ACTION_CLASS[target.action]}>{target.label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {!result.perfectReachable ? (
        <p className="mt-2 text-sm text-red-bright">舍弃值已超过 250，完美配线已无法达成。</p>
      ) : null}
    </section>
  )
}
