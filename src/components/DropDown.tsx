import React, { FC } from 'react'

export const DropDown: FC<IProps> = ({
  keys,
  updateHandler
}) => {
  return (
    <div>
      {keys.map(key => (
        <div onClick={() => updateHandler(key)}>{key}</div>
      ))}
    </div>
  )
}

interface IProps {
  keys: Array<String>
  updateHandler: Function
}
