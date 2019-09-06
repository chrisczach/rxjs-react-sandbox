import React, { FC, useEffect, useState } from 'react'
import { fromEvent } from 'rxjs'
import { pluck } from 'rxjs/operators'
export const MouseEvents: FC = () => {
  const [mouseXY, setMouseXY] = useState()
  useEffect(() => {
    const mouse = fromEvent(document, 'mousemove')
    const observer = mouse.subscribe(({ clientX, clientY }: any) =>
      setMouseXY({ clientX, clientY })
    )

    mouse.subscribe(console.log)
    return () => {
      observer.unsubscribe()
    }
  }, [])
  return <div>{JSON.stringify(mouseXY)}</div>
}
