import React, { FC, useEffect, useState } from 'react'
import { fromEvent } from 'rxjs'
import { takeLast } from 'rxjs/operators'

import styles from './MouseEvents.module.css'

export const MouseEvents: FC = () => {
  const [mouseXY, setMouseXY] = useState({ x: 0, y: 0 })
  const [mouseDownXY, setMouseDownXY] = useState({ isDown: false, x: 0, y: 0 })
  const [mouseUpXY, setMouseUpXY] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const mouseMove = fromEvent(document, 'mousemove').subscribe(
      ({ clientX: x, clientY: y }: any) =>
        requestAnimationFrame(() => setMouseXY({ x, y }))
    )

    const mouseDown = fromEvent(document, 'mousedown').subscribe(
      ({ clientX: x, clientY: y }: any) =>
        requestAnimationFrame(() => setMouseDownXY({ isDown: true, x, y }))
    )

    const mouseUp = fromEvent(document, 'mouseup').subscribe(
      ({ clientX: x, clientY: y }: any) =>
        requestAnimationFrame(() => {
          setMouseDownXY(prevState => ({ ...prevState, isDown: false }))
          setMouseUpXY({ x, y })
        })
    )
    return () => {
      mouseMove.unsubscribe()
      mouseDown.unsubscribe()
      mouseUp.unsubscribe()
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.stats}>{`Position ${JSON.stringify(
        mouseXY,
        null,
        2
      )}`}</div>
      <div className={styles.stats}>{`Mouse Down Position ${JSON.stringify(
        mouseDownXY,
        null,
        2
      )}`}</div>
      <div className={styles.stats}>{`Mouse Up Position ${JSON.stringify(
        mouseUpXY,
        null,
        2
      )}`}</div>
      <div style={{ left: mouseXY.x + 'px' }} className={styles.vertical} />
      <div style={{ top: mouseXY.y + 'px' }} className={styles.horizontal} />
      <div
        style={{ top: mouseXY.y + 'px', left: mouseXY.x + 'px' }}
        className={styles.crosshair}
      />
    </div>
  )
}
