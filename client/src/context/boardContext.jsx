import { useContext } from "react";

const boardContext = useContext()

const boardProvider = ({ children }) => {
  return (
    <div>boardContext</div>
  )
}

export default boardContext