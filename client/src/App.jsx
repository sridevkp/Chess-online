import { useState } from 'react'
import './App.css'
import Nav from './components/Nav'
import Controller from './components/Controller'
import Chess from './components/Chess'

function App() {

  return (
    <>
      <main className='grid p-2 gap-2  grid-rows-[50px,92vh,200px] grid-cols-1 md:grid-rows-[50px,92vh] md:grid-cols-[3fr,1fr] h-dvh'>
        <Nav/>
        <Chess/>
        <Controller/>
      </main>
    </>
  )
}

export default App
