import React, { FC } from 'react'

import styles from './StartScreen.module.css'

export const StartScreen: FC = () => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.start}>Start Screen</span>
      <span className={styles.instructions}>
        Select playground example from drop down menu on top right
      </span>
    </div>
  )
}

export default { StartScreen }
