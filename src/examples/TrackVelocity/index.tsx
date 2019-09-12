import React, { FC, useRef } from 'react'
import styles from './index.module.css'
import { useEventCallback } from 'rxjs-hooks'
import { map, switchMap, scan, tap } from 'rxjs/operators'
import { of, from, concat, fromEvent } from 'rxjs'
export const TrackVelocity: FC = () => {
  const trackableRef = useRef(null)
  const [clickCallback, [status]] = useEventCallback(
    event$ => {
      const starter$ = event$.pipe(scan(togglePause, false))
      return starter$.pipe(
        switchMap(started =>
          started ? fromEvent(document, 'mousemove') : from(['stopped'])
        ),
        map((status: any): any => [status, trackableRef]),
        tap((state: any) => {
          console.log(
            'chaserTop: ' +
              state[1].current.offsetTop +
              ' chaserLeft:' +
              state[1].current.offsetLeft
          )
          console.log(
            'mouseTop: ' + state[0].clientY + ' mouseLeft:' + state[0].clientX
          )
        })
      )
    },
    ['stopped', trackableRef]
  )
  return (
    <>
      <div onClick={clickCallback} className={styles.wrapper}>
        <div ref={trackableRef} className={styles.chaser} />
      </div>
    </>
  )
}

const togglePause = (acc: boolean): boolean => !acc

export default {
  TrackVelocity
}
