import React, { FC, useEffect, useState } from 'react'
import { fromEvent, merge } from 'rxjs'

import styles from './MouseEvents.module.css'

export const MouseEvents: FC = () => {
  const [mouseXY, setMouseXY] = useState({ x: 0, y: 0 })
  const [clickState, setClickState]: any = useState({
    type: 'mouseup',
    down: { x: 0, y: 0 },
    up: { x: 0, y: 0 }
  })
  const [squares, setSquares]: any = useState([])

  const addSquare = ({ start, end }: any) => {
    console.log(clickState)
    const element = <Square start={start} end={end} />
    setSquares((prev: Array<any>) => [...prev, element])
  }

  const removeSquare = (num = 1) => {
    setSquares((prev: Array<any>) => [...prev].slice(0, prev.length - 1 - num))
  }

  useEffect(() => {
    const mouseMove = fromEvent(document, 'mousemove').subscribe(
      ({ clientX: x, clientY: y }: any) => {
        setMouseXY({ x, y })
      }
    )

    const mouseDown = fromEvent(document, 'mousedown')

    const mouseUp = fromEvent(document, 'mouseup')

    const clickTracker = merge(mouseDown, mouseUp).subscribe(
      ({ type, clientX: x, clientY: y }: any) => {
        const updatedXY =
          type === 'mouseup' ? { up: { x, y } } : { down: { x, y } }
        setClickState((prev: any) => {
          if (type === 'mouseup') {
            addSquare({ start: prev.down, end: { x, y } })
          }
          return { ...prev, type, ...updatedXY }
        })
      }
    )

    return () => {
      mouseMove.unsubscribe()
      clickTracker.unsubscribe()
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.stats}>{`Position ${JSON.stringify(
        mouseXY,
        null,
        2
      )}`}</div>
      <div className={styles.stats}>{`Position ${JSON.stringify(
        clickState,
        null,
        2
      )}`}</div>
      <button
        onClick={e => {
          e.stopPropagation()
          removeSquare()
        }}>
        Remove Square
      </button>

      <div style={{ left: mouseXY.x + 'px' }} className={styles.vertical} />
      <div style={{ top: mouseXY.y + 'px' }} className={styles.horizontal} />
      <div
        style={{ top: mouseXY.y + 'px', left: mouseXY.x + 'px' }}
        className={styles.crosshair}
      />

      {[
        ...squares,
        <Square
          start={clickState.down}
          current
          end={mouseXY}
          show={clickState.type === 'mousedown'}
        />
      ]}
    </div>
  )
}

const Square = ({
  show = true,
  current = false,
  start,
  end
}: {
  show?: boolean
  current?: boolean
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
        opacity: show ? (current ? 0.7 : 0.1) : 0,
        left: x + 'px',
        top: y + 'px',
        width: width + 'px',
        height: height + 'px'
      }}
      className={styles.currentSquare}></div>
  )
}

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
