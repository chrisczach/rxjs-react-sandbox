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
  debounce
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
import { access } from 'fs'

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
      const frames$ = interval(500, animationFrameScheduler).pipe(
        map(num => ({ frame: num }))
      )
      const appState$ = combineLatest(mouseState$, chaserState$, frames$).pipe(
        mapCombinedState,
        scan(
          (
            { elementX, elementY, ...acc },
            { running, clientX, clientY, ...curr }
          ) => {
            const nextX = running
              ? clientX > elementX
                ? elementX + 10
                : elementX - 10
              : elementX
            const nextY = running
              ? clientY > elementY
                ? elementY + 10
                : elementY - 10
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
        ),
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

export default {
  TrackVelocity
}
