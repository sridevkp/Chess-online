import React, { useEffect, useRef, useState } from 'react'
import { Image, Layer, Stage } from "react-konva"
import bg from "../assets/blue-labelled.png"
import useBoard from '../hooks/useBoard'
import Piece from './Piece'

import { KING, KNIGHT, QUEEN, PAWN, ROOK, BISHOP, BLACK, WHITE } from 'chess.js'

const image = new window.Image()
image.src = bg

const ChessBoard = () => {
  const { board, setBoard } = useBoard()
  const [ size, setSize ] = useState(1)
  const ele = useRef()

  useEffect( () => {
    const handleResize = () => {
      setSize( Math.min( ele.current.clientHeight, ele.current.clientWidth ));
      // console.log(ele.current.clientHeight,ele.current.clientWidth)
    };
    window.addEventListener("resize", handleResize);
    handleResize()
    return () => window.removeEventListener("resize", handleResize);
  },[])

  const handleDragEnd = ({ target }, type ) => {
    const boardCords = posToCords( target.attrs )
    console.log( type )
  }
  const posToCords = ({ x, y }) => {
    const cellSize = size/8
    return { x : Math.floor(x/cellSize), y : 8-Math.floor(y/cellSize)}
  }
  const posToNotation = ({ x, y }) => {
    return ["a","b","c","d","e","f","g","h"][x]+String(Math.round(y))
  }
  const notationToPos = not => {
    // console.log( not )
    return {
          x : ["a","b","c","d","e","f","g","h"].indexOf(not.split("")[0]),
          y : Number(not.split("")[1])
        }
  }
  return (
    <div className='flex-1 flex justify-center' ref={ele}>
      <Stage width={size} height={size} className='place-content-center'>
        <Layer name='bg'>
          <Image image={image} width={size} height={size}/>
        </Layer>
        <Layer>
          {
            ...board.board().flat().map( piece => {
              if( !piece) return <></>;
              const { x, y } = notationToPos(piece.square)
              return <Piece x={x} y={y-1} boardSize={size} type={piece.type} color={piece.color} onDragEnd={e => handleDragEnd( e, piece.type )}/>
            })
          }
        </Layer>
      </Stage>
    </div>
  )
}
export default ChessBoard
