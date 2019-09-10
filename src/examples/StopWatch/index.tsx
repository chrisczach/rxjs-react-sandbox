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
      scan(togglePause, false)
    )

    const starter$ = of(false)

    const timer$ = concat(starter$, pauser$).pipe(
      switchMap(started => (started ? timer(0, 10) : NEVER)),
      scan(incrementTime),
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
      map(toTime),
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
      {laps.map((value, index, array) => (
        <div
          style={{
            padding: '20px',
            border: '1px solid var(--color-main-light)'
          }}>
          <div>
            Lap Time:{' '}
            {prettyms((index === 0 ? value : value - array[index - 1]) * 10)}
          </div>
          <div>Total Time: {prettyms(value * 10)}</div>
        </div>
      ))}
    </>
  )
}

//Utilities
const buttonsOnly = (action?: StopWatchAction) => ({ target }: any) =>
  target.value &&
  [startStop, lap, reset].indexOf(target.value) !== -1 &&
  (!action || target.value === action)
const toTime = ([_, time]: any) => time
const toAction = ({ target: { value } }: any) => value
const togglePause = (acc: boolean): boolean => !acc
const stopEmitZero = (number: number): boolean => number !== 0
const incrementTime = (acc: number): number => acc + 1
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
