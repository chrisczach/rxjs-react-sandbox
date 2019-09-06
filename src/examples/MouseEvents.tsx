import React, { FC, useEffect, useState } from 'react'
import { fromEvent } from 'rxjs'
import { takeLast } from 'rxjs/operators'

import styles from './MouseEvents.module.css'

export const MouseEvents: FC = () => {
  const [mouseXY, setMouseXY] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const mouse = fromEvent(document, 'mousemove')
    const observer = mouse.subscribe(({ clientX: x, clientY: y }: any) =>
      requestAnimationFrame(() => setMouseXY({ x, y }))
    )

    return () => {
      observer.unsubscribe()
    }
  }, [])
  return (
    <div className={styles.wrapper}>
      <div style={{ left: mouseXY.x + 'px' }} className={styles.vertical} />
      <div style={{ top: mouseXY.y + 'px' }} className={styles.horizontal} />
      <div
        style={{ top: mouseXY.y + 'px', left: mouseXY.x + 'px' }}
        className={styles.crosshair}
      />
    </div>
  )
}
