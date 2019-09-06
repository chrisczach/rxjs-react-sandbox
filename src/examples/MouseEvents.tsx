import React, { FC, useEffect, useState } from 'react'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import styles from './MouseEvents.module.css'

export const MouseEvents: FC = () => {
  const [mouseXY, setMouseXY] = useState({ x: 0, y: 0 })
  const [mouseDownXY, setMouseDownXY] = useState({ isDown: false, x: 0, y: 0 })
  const [mouseUpXY, setMouseUpXY] = useState({ x: 0, y: 0 })
  const [squares, setSquares]: any = useState([])

  // const addSquare = ({
  //   start,
  //   end
  // }: {
  //   start: { x: number; y: number }
  //   end: { x: number; y: number }
  // }) => {
  //   const x = Math.min(start.x, end.x)
  //   const y = Math.min(start.y, end.y)
  //   const width = Math.max(start.x, end.x) - x + 'px'
  //   const height = Math.max(start.y, end.y) - y + 'px'
  //   setSquares((prev: any) => [
  //     ...prev,
  //     <div
  //       style={{ top: y + 'px', left: x + 'px', width, height }}
  //       className={styles.square}></div>
  //   ])
  // }

  useEffect(() => {
    const mouseMove = fromEvent(document, 'mousemove').subscribe(
      ({ clientX: x, clientY: y }: any) =>
        requestAnimationFrame(() => setMouseXY({ x, y }))
    )

    const mouseDown = fromEvent(document, 'mousedown').subscribe(
      ({ clientX: x, clientY: y }: any) => {
        requestAnimationFrame(() => setMouseDownXY({ isDown: true, x, y }))
      }
    )

    const mouseUp = fromEvent(document, 'mouseup').subscribe(
      ({ clientX: x, clientY: y }: any) => {
        requestAnimationFrame(() => {
          setMouseUpXY({ x, y })
          setMouseDownXY(prevState => ({ ...prevState, isDown: false }))
        })
      }
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

      {squares}
      <CurrentSquare start={mouseDownXY} end={mouseXY} />
    </div>
  )
}

const CurrentSquare = ({
  start,
  end
}: {
  start: { x: number; y: number; isDown: boolean }
  end: { x: number; y: number }
}) => {
  const x = Math.min(start.x, end.x)
  const y = Math.min(start.y, end.y)
  const width = Math.max(start.x, end.x) - x
  const height = Math.max(start.y, end.y) - y
  return (
    <div
      style={{
        opacity: start.isDown ? 1 : 0,
        left: x + 'px',
        top: y + 'px',
        width: width + 'px',
        height: height + 'px'
      }}
      className={styles.currentSquare}></div>
  )
}
