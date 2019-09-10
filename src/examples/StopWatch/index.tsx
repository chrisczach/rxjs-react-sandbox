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

import {
  buttonsOnly,
  toTime,
  togglePause,
  stopEmitZero,
  incrementTime,
  reset,
  startStop,
  lap,
  resetHelper,
  lapHelper
} from './utilities'

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
export default {
  StopWatch
}
