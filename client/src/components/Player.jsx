import { useContext, useEffect, useState } from "react";
import defaultImg from "./../assets/default.jpeg"
import ChessContext from "../context/ChessProvider";

const criticalTime = 30*1000 ;

const Player = ({ name, color, time }) => {
  const { chess } = useContext(ChessContext);
  const [timeLeft, setTimeLeft] = useState( time );
  const [ isCurrent, setIsCurrent ] = useState( true )

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     chess.turn() == color && setTimeLeft( prevTime => Math.max( 0, prevTime - 10)); 
  //   }, 10);

  //   return () => clearInterval(interval);
  // }, []);
  // useEffect( () => {
  //   console.log("re rendered")
  //   setIsCurrent( chess.turn() == color )
  // }),[chess]

  const formatTime = time => {
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const ms = Math.floor((time % 1000) / 10);
    return timeLeft > criticalTime 
          ?`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          :`${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`
  }

  return (
    <div className={`h-20 flex items-center ${ !isCurrent && "opacity-50"}`}>
      <img src={defaultImg} className={"h-16 rounded-full p-2"}/>
      <div className="ml-2">
        <h2 className="text-xl font-bold">{name} 🏁</h2>
        <p>♗♘♞♟</p>
      </div>
      <div className={`text-xl font-extrabold ml-auto bg-green-900 p-1 px-3 rounded-md ${ timeLeft < criticalTime && "bg-red-900"}`}>
        {formatTime(timeLeft)}
      </div>
    </div>
  )
}

export default Player