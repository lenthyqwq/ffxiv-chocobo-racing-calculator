import { useEffect, useMemo, useReducer, useState } from 'react'
import { inputReducer, initialInput, toChocoboState, canFeed } from './state/input-reducer.ts'
import { encodeState, decodeParams } from './state/url.ts'
import { parseInput } from './schema/state.ts'
import { STAT_NAMES } from './types/stats.ts'
import { advise } from './math/advisor.ts'
import { RankInput } from './components/rank-input.tsx'
import { AttributeBar } from './components/attribute-bar.tsx'
import { DumpSelector } from './components/dump-selector.tsx'
import { FeedsPanel } from './components/feeds-panel.tsx'
import { OddsPanel } from './components/odds-panel.tsx'
import { AdvicePanel } from './components/advice-panel.tsx'
import { ConfirmDialog } from './components/confirm-dialog.tsx'
import { SECONDARY_BUTTON } from './components/styles.ts'

/** Root component: the input form (left) and the Feeds, Odds, and Advice panels (right). */
export default function App() {
  const [state, dispatch] = useReducer(inputReducer, initialInput, () => parseInput(decodeParams(window.location.search)) ?? initialInput)
  const result = useMemo(() => advise(toChocoboState(state)), [state])

  useEffect(() => {
    window.history.replaceState(null, '', '?' + encodeState(state))
  }, [state])

  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="mx-auto max-w-[1012px] p-6">
      <header className="mb-6">
        <h1 className="font-display text-2xl text-gold">完美陆行鸟顾问</h1>
        <p className="mt-1 text-sm text-muted">输入你陆行鸟当前的等级和属性值，即可查看从当前状态继续的胜率。</p>
      </header>

      <div className="grid items-start gap-6 min-[845px]:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-display text-lg text-gold">你的陆行鸟</h2>
            <button type="button" onClick={() => setConfirmOpen(true)} className={`${SECONDARY_BUTTON} text-muted hover:text-cream`}>
              重置
            </button>
          </div>
          <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-5">
            <RankInput rank={state.rank} onChange={(rank) => dispatch({ type: 'setRank', rank })} />
            <DumpSelector dumpIndex={state.dumpIndex} onChange={(index) => dispatch({ type: 'setDump', index })} />
            <div role="group" aria-labelledby="attrs-heading" className="flex flex-col gap-2">
              <h3 id="attrs-heading" className="font-display text-gold">
                属性
              </h3>
              {STAT_NAMES.map((name, i) => (
                <AttributeBar
                  key={name}
                  name={name}
                  value={state.values[i]}
                  isDump={i === state.dumpIndex}
                  feeds={state.feeds[i]}
                  canFeedUp={canFeed(state, i)}
                  onSetValue={(value) => dispatch({ type: 'setValue', index: i, value })}
                  onNudge={(delta) => dispatch({ type: 'nudgeValue', index: i, delta })}
                  onFeedUp={() => dispatch({ type: 'feedUp', index: i })}
                  onFeedDown={() => dispatch({ type: 'feedDown', index: i })}
                />
              ))}
            </div>
          </form>
        </section>

        <div className="flex flex-col gap-6 min-[845px]:sticky min-[845px]:top-6">
          <FeedsPanel feeds={result.feeds} />
          <OddsPanel result={result} />
          <AdvicePanel result={result} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="重置陆行鸟？"
        message="这将清除你当前的输入和分享链接。"
        confirmLabel="重置"
        onConfirm={() => {
          dispatch({ type: 'reset' })
          setConfirmOpen(false)
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
