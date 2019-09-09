import React, { FC, useState, useEffect } from 'react'
import { timer, concat, NEVER, of, fromEvent } from 'rxjs'
import { scan, tap, filter, switchMap, map } from 'rxjs/operators'

export const StopWatch: FC = () => {
  const [time, setTime] = useState(0)
  useEffect(() => {
    const clicks$ = fromEvent(document, 'click')
    const pauser$ = clicks$.pipe(
      filter(buttonsOnly(startStop)),
      scan(acc => !acc, false)
    )

    const clickLogger$ = clicks$
      .pipe(
        filter(buttonsOnly()),
        map(toAction)
      )
      .subscribe(console.log)

    const starter$ = of(false)
    concat(starter$, pauser$)
      .pipe(
        switchMap(started => (started ? timer(0, 10) : NEVER)),
        scan(acc => acc + 1, 0)
      )
      .subscribe(setTime)
    return () => {}
  }, [])

  return (
    <>
      <div>{time}</div>
      <button value={startStop}>Start/Stop</button>
      <button value={lap}>Lap</button>
      <button value={reset}>reset</button>
    </>
  )
}

//Utilities
const buttonsOnly = (action?: StopWatchAction) => ({ target }: any) =>
  target.value &&
  [startStop, lap, reset].indexOf(target.value) !== -1 &&
  (!action || target.value === action)

const toAction = ({ target: { value: action } }: any) => action

const timesToLaps = (time: number, i: number, a: Array<number>) => (
  <div>
    <div>
      Lap {i + 1} time: {(time - a[i - 1] || time).toFixed(2)} Total Time:{' '}
      {time}
    </div>
  </div>
)

const toSeconds = (num: any): number => num / 100

const [startStop, lap, reset]: Array<StopWatchAction> = [
  'startStop',
  'lap',
  'reset'
]

type StopWatchAction = 'startStop' | 'lap' | 'reset'

export default {
  StopWatch
}
