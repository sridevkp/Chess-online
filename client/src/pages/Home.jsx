import React, { useEffect, useState } from 'react'
import bg from "../assets/blue-labelled.png"
import socket from '../socket/socket'
import Button from '../components/Button'

const Home = () => {
  const [ matching ,setMatching ] = useState(false)

  const handleClick = e => {
    if( matching ) return ;
    socket.emit( "match", {} )
  }

  useEffect(()=>{
    socket.on("matching",()=>{
      setMatching( true )
    })
  },[])

  return (
    <div className='container h-dvh w-full flex items-center justify-center'>
        <img className='w-96' src={bg}/>
        <div className='backdrop-blur w-screen h-screen absolute top-0 left-0 flex justify-evenly items-center'>
          <Button onClick={handleClick}>{ matching?"Matching...":"Match" }</Button>
        </div>
    </div>
  )
}

export default Home