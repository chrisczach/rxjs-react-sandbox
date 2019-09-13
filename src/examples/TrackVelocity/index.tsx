import React, { FC, useRef, MutableRefObject } from 'react'
import styles from './index.module.css'
import { useEventCallback } from 'rxjs-hooks'
import {
  map,
  switchMap,
  scan,
  tap,
  switchMapTo,
  mergeMap,
  startWith,
  pluck
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
      const appState$ = combineLatest(mouseState$, chaserState$).pipe(
        mapCombinedState,
        switchMap(({ running, ...positions }) => {
          if (running) {
            //do stuff trigger interval
            return of({ ...positions, running })
          } else {
            return of({ ...positions, running })
          }
        }),
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
          style={{ transform: `translate(${clientX}px,${clientY}px)` }}
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
