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
  startWith
} from 'rxjs/operators'
import {
  of,
  from,
  concat,
  fromEvent,
  NEVER,
  Observable,
  interval,
  animationFrameScheduler
} from 'rxjs'

export const TrackVelocity: FC = () => {
  const trackableRef: any = useRef(null)
  const [
    clickCallback,
    { clientX, clientY, elementX, elementY, offsetX, offsetY }
  ]: any = useEventCallback(
    event$ => {
      const starter$ = event$.pipe(
        // tap(({ clientX, clientY }: any) => console.log(clientX, ' ', clientY)),
        startPause,
        listenToMouseMoves,
        mapOffsetXY(trackableRef),
        mapDirectionAndSpeed,
        logState
      )

      return starter$
    },
    [trackableRef]
  )

  return (
    <>
      <div onClick={clickCallback} className={styles.wrapper}>
        <div
          style={{ transform: `translate(${offsetX}px,${offsetY}px)` }}
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

const listenToMouseMoves = switchMap(({ running, clientX, clientY }): any =>
  running
    ? fromEvent(document, 'mousemove').pipe(
        startWith({ running, clientX, clientY })
      )
    : of({ running, clientX, clientY })
)

const mapOffsetXY = (ref: any) =>
  map(({ clientX, clientY, ...rest }: any): any => {
    const elementX = ref.current.offsetLeft
    const elementY = ref.current.offsetTop
    const offsetX = clientX - elementX
    const offsetY = clientY - elementY
    return {
      ...rest,
      offsetX,
      offsetY
    }
  })

const translateElementXY = switchMap(({ offsetX, offsetY, ...rest }: any) =>
  offsetX !== 0 || offsetY !== 0
    ? interval(10, animationFrameScheduler).pipe(
        map((_: any) => ({ ...rest, offsetX, offsetY }))
      )
    : NEVER
)

const mapDirectionAndSpeed = scan((a, c: any) => ({ ...a, ...c }), {
  translateX: 0,
  translateY: 0
})

// const translateTarget = ({ current: { offSetTop, offSetLeft } }) =>
//   tap(({ status: { clientY, clientX } }: any) => {
//     offSetTop = offSetTop - (clientY - offSetTop) / 2
//     offSetLeft = offSetTop - (clientX - offSetTop) / 2
//   })

const logState = tap((state: any) => console.log(JSON.stringify(state)))

export default {
  TrackVelocity
}
