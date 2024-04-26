import { useContext } from 'react'
import BoardContext from '../context/BoardProvider'

const useBoard = () => {
  return useContext(BoardContext)
}

export default useBoard