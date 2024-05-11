import React, { useContext } from 'react'
import ChessBoard from './ChessBoard'
import Player from './Player'
import UserContext from '../context/UserProvider'

const Chess = ({ gameId }) => {
  const timeLeft = 0//3*60*1000 ;
  const { user } = useContext(UserContext)
  return (
    <div className='bg-zinc-700 p-5 flex flex-col justify-center items-stretch rounded-md snap-start'>
        <Player name={"Opponent"} color={user.color=="w"?"b":"w"} time={ timeLeft }/>
        <ChessBoard gameId={gameId}/>
        <Player name={"You"} color={user.color} time={ timeLeft }/>
    </div>  
    
  )
}

export default Chess