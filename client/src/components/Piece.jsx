import { Image } from "react-konva"

import wKing from "../assets/w-king.png"
import wQueen from "../assets/w-queen.png"
import wRook from "../assets/w-rook.png"
import wBishop from "../assets/w-bishop.png"
import wKnight from "../assets/w-knight.png"
import wPawn from "../assets/w-pawn.png"


import bKing from "../assets/b-king.png"
import bQueen from "../assets/b-queen.png"
import bRook from "../assets/b-rook.png"
import bBishop from "../assets/b-bishop.png"
import bKnight from "../assets/b-knight.png"
import bPawn from "../assets/b-pawn.png"
import { useContext, useEffect, useState } from "react"
import ChessContext from "../context/ChessProvider"
import UserContext from "../context/UserProvider"

const clamp = ( a, x, b ) => Math.max( a, Math.min(x, b) )

const images = {
    w:{
        k : wKing,
        q : wQueen,
        r : wRook,
        b : wBishop,
        n: wKnight,
        p : wPawn,
    },
    b:{
        k : bKing,
        q : bQueen,
        r : bRook,
        b : bBishop,
        n : bKnight,
        p : bPawn,
    },
}

const Piece = ({ x, y, boardSize, color, type, onDragEnd }) => {
    const [initialPosition, setInitialPosition] = useState({ x, y });
    const [position, setPosition] = useState({ x, y });
    const { user } = useContext(UserContext)
    const { chess } = useContext(ChessContext)
    const image = new window.Image()
    image.src = images[color][type]

    const size = boardSize /8
    const offset = size/2

    useEffect(() => {
        setPosition({x,y})
    },[boardSize])

    const handleDragEnd = (e) => {
        const { x, y } = e.target.position();
        setPosition({ x, y });
        const invalidMove = onDragEnd(e);
        if( invalidMove ){
            setPosition( initialPosition )
        }

    };

    const handleDragStart = () => {
        setInitialPosition({ x: position.x, y: position.y });
    };

    const handleDragMove = (e) => {
        const { x, y } = e.target.position();
        setPosition({ x, y });
    };
    const handleDragCancel = () => {
        setPosition({ x: initialPosition.x, y: initialPosition.y });
      };
      
    return (
        <Image 
            x={position.x} 
            y={position.y} 
            offset={{x:offset,y:offset}}
            width={size} 
            height={size} 
            image={image}
            draggable={user.color == color && chess.turn()==color}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragCancel={handleDragCancel}
            dragBoundFunc={ pos => {
                return {
                    x : clamp( offset, pos.x, boardSize-offset),
                    y : clamp( offset, pos.y, boardSize-offset)
                }
            }}
        />
    )
}

export default Piece