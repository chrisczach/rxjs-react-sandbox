import React, { FC, useState } from 'react'
import './App.module.css'
import examples from './examples'
import { DropDown } from './components/DropDown'

const App: FC = () => {
  const [activeExample, setActiveExample] = useState(`StartScreen`)

  return (
    <div>
      <DropDown keys={Object.keys(examples)} updateHandler={setActiveExample} />
      {activeExample}
    </div>
  )
}

export default App
