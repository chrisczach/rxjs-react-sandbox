import React, { FC, useState, useEffect } from 'react'
import { timer, concat, NEVER, of, fromEvent } from 'rxjs'
import prettyms from 'pretty-ms'
import {
  scan,
  tap,
  filter,
  switchMap,
  map,
  startWith,
  withLatestFrom,
  distinctUntilChanged
} from 'rxjs/operators'

export const StopWatch: FC = () => {
  const [time, setTime] = useState(0)
  const [laps, setLaps] = useState([])

  useEffect(() => {
    console.log('effect rendered')
    const resetToZero = resetHelper(setLaps)
    const addLaps = lapHelper(setLaps)
    const clicks$ = fromEvent(document, 'click')

    const pauser$ = clicks$.pipe(
      filter(buttonsOnly(startStop)),
      scan(acc => !acc, false)
    )

    const starter$ = of(false)

    const timer$ = concat(starter$, pauser$).pipe(
      switchMap(started => (started ? timer(0, 10) : NEVER)),
      scan(acc => acc + 1),
      startWith(0),
      tap(setTime)
    )

    const reset$ = clicks$.pipe(
      filter(buttonsOnly(reset)),
      startWith(timer$),
      switchMap(resetToZero(timer$))
    )

    const lap$ = clicks$.pipe(
      filter(buttonsOnly(lap)),
      withLatestFrom(reset$),
      map(([_, time]: any) => time),
      filter(stopEmitZero),
      distinctUntilChanged(),
      tap(addLaps)
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
      <div>{prettyms(time * 10)}</div>
      <button value={startStop}>Start/Stop</button>
      <button value={lap}>Lap</button>
      <button value={reset}>reset</button>
      {laps.map(value => (
        <div>{prettyms(value * 10)}</div>
      ))}
    </>
  )
}

//Utilities
const buttonsOnly = (action?: StopWatchAction) => ({ target }: any) =>
  target.value &&
  [startStop, lap, reset].indexOf(target.value) !== -1 &&
  (!action || target.value === action)

const toAction = ({ target: { value } }: any) => value

const stopEmitZero = (number: number) => number !== 0

const resetHelper = (updateLaps: Function) => (timer: any) => () => {
  updateLaps([])
  return timer
}

const lapHelper = (updater: Function) => (time: number) =>
  updater((laps: Array<number>) => [...laps, time])

// const toTime = ([_, time]: [any, number]) => time

const [startStop, lap, reset]: Array<StopWatchAction> = [
  'startStop',
  'lap',
  'reset'
]

type StopWatchAction = 'startStop' | 'lap' | 'reset'

export default {
  StopWatch
}
