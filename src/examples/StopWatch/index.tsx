import React, { FC, useState, useEffect } from 'react'
import { interval, animationFrameScheduler, fromEvent } from 'rxjs'
import { tap, map, withLatestFrom } from 'rxjs/operators'

export const StopWatch: FC = () => {
  const [isRunning, setRunning] = useState(false)
  const [currentTime, setCurrentTime]: [number, Function] = useState(0)
  const [startTime, setStartTime]: [number, Function] = useState(0)
  const [laps, setLaps]: [Array<any>, Function] = useState([])
  const [pausedTime, setPausedTime] = useState(0)
  const totalTime: any = isRunning ? currentTime - startTime + pausedTime : 0

  const updateTime = (time: any) => setCurrentTime(time)
  const toSeconds = (num: any) => (num / 100).toFixed(2)
  const addLap = () => console.log('add lap ' + isRunning)
  // setLaps((prev: any) => [...prev, currentTime - startTime])
  const startStopAction = (time: number) => {
    setRunning((prev: boolean) => {
      if (prev) {
        setPausedTime((_: any) => currentTime - startTime + pausedTime)
        return !prev
      } else {
        setStartTime(time)
        return true
      }
    })
  }
  const resetLaps = () => setLaps([])
  const resetAction = () => {
    setStartTime(0)
    resetLaps()
    setRunning(false)
  }
  const updateState = ({
    action,
    time
  }: {
    action: StopWatchAction
    time: number
  }) => {
    if (action === startStop) {
      startStopAction(time)
    } else if (action === lap) {
      addLap()
    } else if (action === reset) {
      resetAction()
    }
  }

  useEffect(() => {
    console.log('effect rendered')
    const time$ = interval(10, animationFrameScheduler).pipe(
      map(toSeconds),
      tap(updateTime)
    )
    const timerControl$ = fromEvent(document, 'click').pipe(
      withLatestFrom(time$),
      map(toClickValue),
      tap(updateState)
    )

    const timerObserver = timerControl$.subscribe()
    return () => {
      timerObserver.unsubscribe()
    }
  }, [])
  return (
    <>
      <div>Running: {isRunning ? 'Running' : 'Stopped'}</div>
      <div>Start Time: {startTime}</div>
      <div>Current Time: {currentTime}</div>
      <div>Total Time: {totalTime}</div>
      <button value={startStop}>Start/Stop</button>
      <button value={lap}>Lap</button>
      <button value={reset}>reset</button>
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

const toClickValue = ([
  {
    target: { value: action }
  },
  time
]: any) => ({ action, time })

const [startStop, lap, reset]: Array<StopWatchAction> = [
  'startStop',
  'lap',
  'reset'
]

type StopWatchAction = 'startStop' | 'lap' | 'reset'

export default {
  StopWatch
}
