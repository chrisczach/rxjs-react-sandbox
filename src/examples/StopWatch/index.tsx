import React, { FC, useState, useEffect } from 'react'
import { timer, concat, NEVER, of, fromEvent, Observable } from 'rxjs'
import { scan, tap, filter, switchMap, map, startWith } from 'rxjs/operators'

export const StopWatch: FC = () => {
  const [time, setTime] = useState(0)
  const [laps, setLaps] = useState([])

  useEffect(() => {
    console.log('effect rendered')
    const resetToZero = resetHelper(setTime)(setLaps)

    const clicks$ = fromEvent(document, 'click')

    const pauser$ = clicks$.pipe(
      filter(buttonsOnly(startStop)),
      scan(acc => !acc, false)
    )

    const starter$ = of(false)

    const lap$ = clicks$.pipe(
      filter(buttonsOnly(lap)),
      tap(console.log)
    )

    const timer$ = concat(starter$, pauser$).pipe(
      switchMap(started => (started ? timer(0, 10) : NEVER)),
      scan(acc => acc + 1, 0),
      tap(setTime)
    )

    const reset$ = clicks$.pipe(
      filter(buttonsOnly(reset)),
      startWith(timer$),
      switchMap(resetToZero(timer$))
    )

    const timerObserver = reset$.subscribe()
    const lapObserver = lap$.subscribe()
    return () => {
      timerObserver.unsubscribe()
      lapObserver.unsubscribe()
    }
  }, [setTime, setLaps])

  return (
    <>
      <div>{time}</div>
      <button value={startStop}>Start/Stop</button>
      <button value={lap}>Lap</button>
      <button value={reset}>reset</button>
      {laps.map(value => (
        <div>{value}</div>
      ))}
    </>
  )
}

//Utilities
const buttonsOnly = (action?: StopWatchAction) => ({ target }: any) =>
  target.value &&
  [startStop, lap, reset].indexOf(target.value) !== -1 &&
  (!action || target.value === action)

const resetHelper = (updateTime: Function) => (updateLaps: Function) => (
  timer: Observable<any>
) => () => {
  updateTime(0)
  updateLaps([])
  return timer
}

const [startStop, lap, reset]: Array<StopWatchAction> = [
  'startStop',
  'lap',
  'reset'
]

type StopWatchAction = 'startStop' | 'lap' | 'reset'

export default {
  StopWatch
}
