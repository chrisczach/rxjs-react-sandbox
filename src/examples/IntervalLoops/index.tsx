import React, { FC, useState, useEffect } from 'react'
import { interval } from 'rxjs'
export const IntervalLoops: FC = () => {
  const [time, setTime]: [Array<number>, Function] = useState([])
  const pushToState = (num: number) =>
    setTime((prev: Array<number>) => [...prev, num])
  useEffect(() => {
    const timer = interval(500)
    const timerObserver = timer.subscribe(pushToState)
    return () => {
      timerObserver.unsubscribe()
    }
  }, [])
  return (
    <div>
      {time.map(num => (
        <div>{num}</div>
      ))}
    </div>
  )
}

export default {
  IntervalLoops
}
