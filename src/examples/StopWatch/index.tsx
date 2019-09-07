import React, { FC, useState, useEffect, SetStateAction } from 'react'
import { interval, animationFrameScheduler, from } from 'rxjs'
import { tap } from 'rxjs/operators'

export const StopWatch: FC = () => {
  const [timerState, setTimerState]: [StopWatchAction, Function] = useState(
    stopped
  )

  const [time, setTime]: [number, Function] = useState(0)
  const [laps, setLaps]: [Array<any>, Function] = useState([])

  const updateTime = (num: any) => setTime(num / 100)
  const addLap = () => setLaps((prev: any) => [...prev, time])
  const resetLaps = () => setLaps([])
  const updateTimerState = ({ target: { value } }: any) => {
    if (value === reset) resetLaps()
    setTimerState(value)
  }

  useEffect(() => {
    const timer$ = interval(10, animationFrameScheduler)
    const timerObserver = timer$.pipe(tap(updateTime)).subscribe()
    return () => {
      timerObserver.unsubscribe()
    }
  }, [])
  return (
    <>
      <div>Timer State: {timerState}</div>
      <div>Time: {time}</div>
      <button
        onClick={updateTimerState}
        value={timerState === stopped ? running : stopped}>
        Start/Stop
      </button>
      <button onClick={addLap} value={running}>
        Lap
      </button>
      <button onClick={updateTimerState} value={reset}>
        reset
      </button>
      {laps.map(timesToLaps)}
    </>
  )
}

const timesToLaps = (time: number, i: number, a: Array<number>) => (
  <div>
    <div>
      Lap {i + 1} time: {(time - a[i - 1] || time).toFixed(2)} Total Time:{' '}
      {time}
    </div>
  </div>
)

const [stopped, running, reset]: Array<StopWatchAction> = [
  'stopped',
  'running',
  'reset'
]

type StopWatchAction = 'stopped' | 'running' | 'reset'

export default {
  StopWatch
}
