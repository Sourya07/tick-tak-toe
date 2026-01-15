import { useState } from 'react'
import './App.css'
import Board from './tick-tak/board'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <Board />
      </div>
    </>
  )
}

export default App
