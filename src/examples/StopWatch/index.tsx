import React, { FC, useState, useEffect } from 'react'
import { interval, animationFrameScheduler, fromEvent, Subject } from 'rxjs'
import { tap, map, withLatestFrom, startWith, filter } from 'rxjs/operators'

export const StopWatch: FC = () => {

  useEffect(() => {
'effect'
    return () => {
      'cleanup'
    }
  }, [])

  return (
    <>
      <button value={startStop}>Start/Stop</button>
      <button value={lap}>Lap</button>
      <button value={reset}>reset</button>
    </>
  )
}


//Utilities
const buttonsOnly = ({ target }: any) =>
  target.value && [startStop, lap, reset].indexOf(target.value) !== -1

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
