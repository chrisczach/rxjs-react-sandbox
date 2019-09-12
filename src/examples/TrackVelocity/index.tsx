import React, { FC, useRef, MutableRefObject } from 'react'
import styles from './index.module.css'
import { useEventCallback } from 'rxjs-hooks'
import {
  map,
  switchMap,
  scan,
  tap,
  switchMapTo,
  mergeMap
} from 'rxjs/operators'
import { of, from, concat, fromEvent, NEVER, Observable, interval } from 'rxjs'

export const TrackVelocity: FC = () => {
  const trackableRef: any = useRef(null)
  const [clickCallback, status]: any = useEventCallback(
    event$ => {
      const starter$ = event$.pipe(
        startPause,
        listenToMouseMoves,
        mapToTranslateXY(trackableRef),
        translateElementXY,
        logState
      )

      return starter$
    },
    [trackableRef]
  )
  return (
    <>
      <div onClick={clickCallback} className={styles.wrapper}>
        <div ref={trackableRef} className={styles.chaser} />
      </div>
    </>
  )
}

const startPause = scan((acc: boolean): boolean => !acc, false)

const listenToMouseMoves = switchMap(
  (started: boolean): Observable<Event> =>
    started ? fromEvent(document, 'mousemove') : NEVER
)

const mapToTranslateXY = (ref: any) =>
  map(({ clientX, clientY }: any): any => {
    const elementX = ref.current.offsetLeft
    const elementY = ref.current.offsetTop
    const offsetX = clientX - elementX
    const offsetY = clientY - elementY
    return {
      clientX,
      clientY,
      elementX,
      elementY,
      offsetX,
      offsetY
    }
  })

const translateElementXY = switchMap(({ offsetX, offsetY, ...rest }: any) =>
  offsetX !== 0 || offsetY !== 0
    ? interval(100).pipe(map((_: any) => ({ ...rest, offsetX, offsetY })))
    : NEVER
)

// const translateTarget = ({ current: { offSetTop, offSetLeft } }) =>
//   tap(({ status: { clientY, clientX } }: any) => {
//     offSetTop = offSetTop - (clientY - offSetTop) / 2
//     offSetLeft = offSetTop - (clientX - offSetTop) / 2
//   })

const logState = tap((state: any) => console.log(JSON.stringify(state)))

export default {
  TrackVelocity
}
