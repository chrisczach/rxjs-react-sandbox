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
      const chaserState$ = of({ elementX: 0, elementY: 0 })
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

const updateChaserLocation = scan(
  (
    { elementX, elementY, ...acc },
    { running, clientX, clientY, ...curr }: any
  ) => {
    //need to fix all this
    const pixels = 5
    const difX = clientX - elementX
    const difY = clientY - elementY
    const difTotal = difX + difY
    const translateX = Math.round((pixels / difTotal) * difX)
    const translateY = Math.round((pixels / difTotal) * difY)

    const nextX =
      running && Math.abs(difX) > pixels
        ? clientX > elementX
          ? elementX + pixels
          : elementX - pixels
        : elementX
    const nextY =
      running && Math.abs(difY) > pixels
        ? clientY > elementY
          ? elementY + pixels
          : elementY - pixels
        : elementY

    return {
      ...acc,
      ...curr,
      clientX,
      clientY,
      elementX: nextX,
      elementY: nextY,
      running
    }
  }
)

export default {
  TrackVelocity
}
