import React, { FC, useRef, MutableRefObject } from 'react'
import styles from './index.module.css'
import { useEventCallback } from 'rxjs-hooks'
import {
  map,
  switchMap,
  scan,
  timeInterval,
  tap,
  switchMapTo,
  mergeMap,
  startWith,
  pluck,
  throttle,
  debounce,
  throttleTime
} from 'rxjs/operators'
import {
  of,
  from,
  concat,
  combineLatest,
  fromEvent,
  NEVER,
  Observable,
  interval,
  animationFrameScheduler,
  Subject
} from 'rxjs'

export const TrackVelocity: FC = () => {
  const trackableRef: any = useRef(null)
  const [
    clickCallback,
    { clientX, clientY, elementX, elementY, offsetX, offsetY }
  ]: any = useEventCallback(
    click$ => {
      const mouseState$ = click$.pipe(
        startPause,
        listenToMouseMoves
      )
      const chaserState$ = of({ elementX: 0, elementY: 0, speed: 1 })
      const frames$ = interval(1000 / 60, animationFrameScheduler).pipe(
        map(num => ({ frame: num }))
      )
      const appState$ = combineLatest(mouseState$, chaserState$, frames$).pipe(
        throttleTime(1000 / 60, animationFrameScheduler),
        mapCombinedState,
        updateChaserLocation,
        logState
      )
      return appState$
    },
    [trackableRef]
  )

  return (
    <>
      <div onClick={clickCallback} className={styles.wrapper}>
        <div
          style={{ transform: `translate(${elementX}px,${elementY}px)` }}
          ref={trackableRef}
          className={styles.chaser}
        />
      </div>
    </>
  )
}

const startPause: any = scan(
  ({ running }, { clientX, clientY }: any): any => ({
    clientX,
    clientY,
    running: !running
  }),
  { running: false }
)

const mapCombinedState = map((array: Array<any>) =>
  array.reduce((acc, curr) => ({ ...acc, ...curr }), {})
)

const listenToMouseMoves = switchMap(({ running, clientX, clientY }): any =>
  running
    ? fromEvent(document, 'mousemove').pipe(
        startWith({ running, clientX, clientY }),
        map(({ clientX, clientY }: any) => ({
          running,
          clientX,
          clientY
        }))
      )
    : of({ running, clientX, clientY })
)

const logState = tap((state: any) => console.log(JSON.stringify(state)))

const getAngle = (cx: any, cy: any, ex: any, ey: any): any => {
  const dy = ey - cy
  const dx = ex - cx
  let theta = Math.atan2(dy, dx) // range (-PI, PI]
  theta *= 180 / Math.PI // rads to degs, range (-180, 180]
  return theta
}

const findNewPoint = (
  x: number,
  y: number,
  angle: number,
  distance: number
): { x: number; y: number } => {
  const result = { x: 0, y: 0 }

  result.x = Math.round(Math.cos((angle * Math.PI) / 180) * distance + x)
  result.y = Math.round(Math.sin((angle * Math.PI) / 180) * distance + y)

  return result
}

const updateChaserLocation = scan(
  (
    { speed, elementX, elementY, ...acc },
    { running, clientX, clientY, ...curr }: any
  ) => {
    //need to fix all this
    const distance = speed
    const angle = getAngle(elementX, elementY, clientX, clientY)
    const { x: nextX, y: nextY } = running
      ? findNewPoint(elementX, elementY, angle, distance)
      : { x: elementX, y: elementY }

    return {
      ...acc,
      ...curr,
      clientX,
      clientY,
      elementX: nextX,
      elementY: nextY,
      running,
      speed: speed * 1.005
    }
  }
)

export default {
  TrackVelocity
}
