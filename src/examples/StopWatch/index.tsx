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
    const starter$ = of(false)

    const timer$ = concat(starter$, pauser$)
      .pipe(
        switchMap(started => (started ? timer(0, 10) : NEVER)),
        scan(acc => acc + 1, 0),
        tap(setTime)
      )
      .subscribe()
    return () => {
      timer$.unsubscribe()
    }
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

const [startStop, lap, reset]: Array<StopWatchAction> = [
  'startStop',
  'lap',
  'reset'
]

type StopWatchAction = 'startStop' | 'lap' | 'reset'

export default {
  StopWatch
}
