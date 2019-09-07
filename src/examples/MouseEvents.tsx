import React, { FC, useEffect, useState, createRef } from 'react'
import { fromEvent, merge } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

import styles from './MouseEvents.module.css'
const clickTarget: any = createRef()

export const MouseEvents: FC = () => {
  const [mouseXY, setMouseXY] = useState({ x: 0, y: 0 })
  const [clickState, setClickState]: any = useState({
    type: 'mouseup',
    down: { x: 0, y: 0 },
    up: { x: 0, y: 0 }
  })
  const [squares, setSquares]: any = useState([])
  const [removedSquares, setRemovedSquares]: any = useState([])

  const removeSquare = (num = 1) => {
    if (squares.length === 0) return
    setSquares((prev: Array<any>) => {
      const current = prev.slice(0, prev.length - num)
      const removed = prev.slice(prev.length - num)
      setRemovedSquares((prev: Array<any>) => [...prev, ...removed])
      console.log(removed)
      return current
    })
  }

  const replaceSquare = (num = 1) => {
    if (removedSquares.length === 0) return
    setRemovedSquares((prev: Array<any>) => {
      const stillRemoved = prev.slice(0, prev.length - num)
      const redo = prev.slice(prev.length - num)
      setSquares((prev: Array<any>) => [...prev, ...redo])
      return stillRemoved
    })
  }

  useEffect(() => {
    const addSquare = ({ start, end }: any) => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16)
      const element = (
        <Square color={'#' + randomColor} start={start} end={end} />
      )
      setSquares((prev: Array<any>) => [...prev, element])
      if (removedSquares.length) {
        setRemovedSquares([])
      }
    }

    const mouseMove = fromEvent(document, 'mousemove')
      .pipe(throttleTime(1000 / 60))
      .subscribe(({ clientX: x, clientY: y }: any) => {
        setMouseXY({ x, y })
      })

    const mouseDown = fromEvent(clickTarget.current, 'mousedown')

    const mouseUp = fromEvent(clickTarget.current, 'mouseup')

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
  }, [clickState, removedSquares])

  return (
    <>
      <div className={styles.stats}>{`Cursor Position: ${JSON.stringify(
        mouseXY,
        null,
        2
      )}`}</div>
      <div className={styles.stats}>{`Click Status:  ${JSON.stringify(
        clickState,
        null,
        2
      )}`}</div>
      <button
        style={{ opacity: squares.length ? 1 : 0.25 }}
        className={styles.removeButton}
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          removeSquare()
        }}>
        Undo
      </button>
      <button
        style={{ opacity: removedSquares.length ? 1 : 0.25 }}
        className={styles.removeButton}
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          replaceSquare()
        }}>
        Redo
      </button>

      <div style={{ opacity: clickState.type === 'mousedown' ? 0.1: 1, left: mouseXY.x + 'px' }} className={styles.vertical} />
      <div style={{ opacity: clickState.type === 'mousedown' ? 0.1: 1, top: mouseXY.y + 'px' }} className={styles.horizontal} />
      <div
        style={{ top: mouseXY.y + 'px', left: mouseXY.x + 'px' }}
        className={styles.crosshair}
      />
      <div className={styles.wrapper} ref={clickTarget}>
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
    </>
  )
}

const Square = ({
  show = true,
  color,
  current = false,
  start,
  end
}: {
  show?: boolean
  color?: string
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
        background: color,
        opacity: show ? (current ? 0.7 : 0.1) : 0,
        left: x + 'px',
        top: y + 'px',
        width: width + 'px',
        height: height + 'px'
      }}
      className={color ? styles.square : styles.currentSquare}></div>
  )
}
