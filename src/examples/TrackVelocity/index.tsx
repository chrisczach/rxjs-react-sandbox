import React, { FC, useRef, MutableRefObject } from 'react'
import styles from './index.module.css'
import { useEventCallback } from 'rxjs-hooks'
import { map, switchMap, scan, tap } from 'rxjs/operators'
import { of, from, concat, fromEvent, NEVER, Observable } from 'rxjs'

export const TrackVelocity: FC = () => {
  const trackableRef: any = useRef(null)
  const [clickCallback, status]: any = useEventCallback(
    event$ => {
      const starter$ = event$.pipe(
        startPause,
        listenToMouseMoves,
        mapToTranslateXY,
        logState(trackableRef)
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

const mapToTranslateXY = map((status: any): any => status)

// const translateTarget = ({ current: { offSetTop, offSetLeft } }) =>
//   tap(({ status: { clientY, clientX } }: any) => {
//     offSetTop = offSetTop - (clientY - offSetTop) / 2
//     offSetLeft = offSetTop - (clientX - offSetTop) / 2
//   })

const logState = (ref: any) =>
  tap((status: any) => {
    console.log(
      'chaserTop: ' +
        ref.current.offsetTop +
        ' chaserLeft:' +
        ref.current.offsetLeft
    )
    console.log('mouseTop: ' + status.clientY + ' mouseLeft:' + status.clientX)
  })
export default {
  TrackVelocity
}
