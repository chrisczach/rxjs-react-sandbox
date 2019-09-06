import React, { FC, useEffect } from 'react'
import { fromEvent } from 'rxjs'
export const MouseEvents: FC = () => {
  useEffect(() => {
    const mouse = fromEvent(document, 'mousemove')
    const observer = mouse.subscribe(console.log)

    mouse.subscribe(console.log)
    return () => {
      observer.unsubscribe()
    }
  }, [])
  return <div>MouseEvents</div>
}
