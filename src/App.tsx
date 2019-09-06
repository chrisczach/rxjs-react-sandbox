import React, { FC, useState } from 'react'
import './App.module.css'
import examples from './examples'
import { DropDown } from './components/DropDown'

const App: FC = () => {
  const [activeExample, setActiveExample] = useState(`StartScreen`)
  const ActiveComponent = examples[activeExample]
  return (
    <>
      <DropDown keys={Object.keys(examples)} updateHandler={setActiveExample} />
      <ActiveComponent />
    </>
  )
}

export default App
