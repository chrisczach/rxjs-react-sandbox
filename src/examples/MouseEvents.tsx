import React, { FC, useEffect, useState, createRef } from 'react'
import { fromEvent, merge } from 'rxjs'

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

  const removeSquare = (num = 1) => {
    setSquares((prev: Array<any>) => [...prev].slice(0, prev.length - num))
  }

  useEffect(() => {
    const addSquare = ({ start, end }: any) => {
      console.log(clickState)
      const element = <Square start={start} end={end} />
      setSquares((prev: Array<any>) => [...prev, element])
    }

    const mouseMove = fromEvent(document, 'mousemove').subscribe(
      ({ clientX: x, clientY: y }: any) => {
        setMouseXY({ x, y })
      }
    )

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
  }, [clickState])

  return (
    <>
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
        style={{ opacity: squares.length ? 1 : 0 }}
        className={styles.removeButton}
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
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
