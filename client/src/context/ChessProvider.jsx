import { createContext, useState } from "react";
import { Chess } from 'chess.js'

const ChessContext = createContext({})

export function ChessProvider({ children }) {
  const [ chess, setChess ] = useState( new Chess() )
  
  const resetChess = () => {
    setChess( new Chess() )
  }

  return (
    <ChessContext.Provider value={{ chess, setChess, resetChess }}>
      {children}
    </ChessContext.Provider>
  )
}

export default ChessContext