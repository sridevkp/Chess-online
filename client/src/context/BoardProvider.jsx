import { createContext, useState } from "react";
import { Chess } from 'chess.js'

const BoardContext = createContext({})

export function BoardProvider({ children }) {
  const [ board, setBoard ] = useState( new Chess() )
  return (
    <BoardContext.Provider value={{ board, setBoard }}>
      {children}
    </BoardContext.Provider>
  )
}

export default BoardContext