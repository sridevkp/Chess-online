import React from 'react'
import ChessBoard from './ChessBoard'
import Player from './Player'

const Chess = () => {
  return (
    <div className='bg-zinc-700 p-4 flex flex-col justify-center items-stretch rounded-md snap-start'>
        <Player name={"Player1"}/>
        <ChessBoard/>
        <Player name={"Player2"}/>
    </div>  
    
  )
}

export default Chess