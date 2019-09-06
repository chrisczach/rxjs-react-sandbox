import React, { FC } from 'react'

import styles from './Dropdown.module.css'

export const DropDown: FC<IProps> = ({ keys, updateHandler }) => {
  return (
    <select
      onChange={({ target: { value } }) => updateHandler(value)}
      className={styles.wrapper}>
      <option value='' disabled selected>
        Select example to run
      </option>
      {keys.map(
        key => key !== `StartScreen` && <option value={key}>{key}</option>
      )}
    </select>
  )
}

interface IProps {
  keys: Array<string>
  updateHandler: Function
}
