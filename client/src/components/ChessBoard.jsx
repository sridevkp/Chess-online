import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image, Layer, Stage } from "react-konva"
import Piece from './Piece'
import socket from '../socket/socket'

import bg from "../assets/blue-labelled.png"
import moveAudio from "../assets/impactWood_light_002.ogg"

import ChessContext from '../context/ChessProvider'
import UserContext from '../context/UserProvider'
import Button from './Button'
import { useNavigate } from 'react-router-dom'

const image = new window.Image()
image.src = bg

const ChessBoard = ({ gameId }) => {
  const { chess, resetChess } = useContext(ChessContext)
  const [ gameOver, setGameOver ] = useState(false)
  const [ gameOverMessage, setGameOverMessage ] = useState("")
  const { user, resetUser } = useContext( UserContext )
  const [ board, setBoard ] = useState( [] )
  const [ size, setSize ] = useState(1)
  const audio = useRef()
  const ele = useRef()
  const navigate = useNavigate()

  useEffect( () => {
    const handleResize = () => {
      setSize( Math.min( ele.current.clientHeight, ele.current.clientWidth ));
    };
    window.addEventListener("resize", handleResize);
    handleResize()
    return () => window.removeEventListener("resize", handleResize);
  },[])

  useEffect( () => {
    const moveHandler = ({ move }) => {
      try{
        chess.move( move )
        setBoard( chess.board() )
      }catch(err){
        console.log(err)
      }
    }
    
    const gameOverHandler = (data) => {
      setTimeout( () => setGameOver( true ), 1000 )
      if( data.winner ){
        return setGameOverMessage(`${ data.message } ${ data.winner=="b"? "Black" : "White" } Won`)
      }
      setGameOverMessage( data.message )
    }

    const gameAbandonHandler = () => {
      setGameOver( true )
      setGameOverMessage( "Game abandoned" )
    }

    socket.on("gameover", gameOverHandler )
    socket.on("gameabandoned", gameAbandonHandler )
    socket.on("move", moveHandler )

    return () => {
      socket.off( "gameover",gameOverHandler )
      socket.off("gameabandoned", gameAbandonHandler )
      socket.off("move", moveHandler )
    }
  },[socket]) 

  useEffect( () => {
    setBoard( chess.board() )
  },[chess])
  
  useEffect( () => {
    audio.current.play()
  },[board])

  const handleDragEnd = ( from, to , type ) => {
    const move = {
      from : cordsToNotation( from ),
      to   : cordsToNotation( to )  
    }
    try{
      chess.move( move )
      socket.emit("move", move, gameId , err => {
        if( err ) return console.log(err) ;
      })
      setBoard( chess.board() )
    }catch( err ){
      console.log( err.message )
      return true
    }
    return false
  }
  const posToCords = ({ x, y }) => {
    const cellSize = size/8
    return { 
      x : Math.floor(x/cellSize), 
      y : user.color == "w" ? 7-Math.floor(y/cellSize) : Math.floor(y/cellSize)
    }
  }
  const cordsToPos = ({ x, y }) => {
    const squareSize = size/8
    const offset = squareSize/2
    y = user.color == "w" ? 7-y : y
    return {
      x : x*squareSize + offset,
      y : y*squareSize + offset
    }
  }
  const cordsToNotation = ({ x, y }) => {
    x = user.color =="b"? 7-x : x  
    return ["a","b","c","d","e","f","g","h"][x]+String(Math.floor(y)+1)
  }
  const notationToCords = not => {
    let chars = ["a","b","c","d","e","f","g","h"]
    chars = user.color == "w"? chars : chars.reverse()
    return {
          x : chars.indexOf(not.split("")[0]),
          y : Number(not.split("")[1]-1) 
        }
  }
  const goHome = () =>{
    resetUser()
    resetChess()
    navigate("/")
  }

  return (
    <div className='flex-1 flex justify-center relative' ref={ele}>
      <Stage width={size} height={size} className='place-content-center'>
        <Layer name='bg'>
          <Image image={image} width={size} height={size}/>
        </Layer>
        <Layer>
          {
            ...board.flat().map( piece => {
              if( !piece ) return <></>;
              const cords = notationToCords(piece.square)
              const { x, y } = cordsToPos( cords )
              return <Piece x={x} y={y} boardSize={size} type={piece.type} color={piece.color} onDragEnd={e => handleDragEnd( cords, posToCords(e.target.attrs), piece.type )}/>
            })
          }
        </Layer>
      </Stage>
      { 
        gameOver
        && <div className='absolute backdrop-blur-xl w-full h-full flex flex-col items-center justify-center gap-6'>
            <div className='text-center'>
              <h5 className='text-6xl text-slate-200 font-bold [text-shadow:1px_1px_2px_black]'>Game over</h5>
              <h4 className='text-4xl text-slate-700 font-bold [text-shadow:1px_1px_2px_black]'>{ gameOverMessage }</h4> 
            </div>
            <Button onClick={ goHome }>Play again</Button>
          </div> 
      }
      <audio src={moveAudio} ref={audio}/>
    </div>
  )
}
export default ChessBoard
