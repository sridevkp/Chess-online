import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';
import Menu from './pages/Menu';
import socket from './socket/socket';
import { ChessProvider } from './context/ChessProvider';
import { useContext, useEffect } from 'react';
import UserContext from './context/UserProvider';

function App() {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect( () => {
    socket.on("start", data => {
      setUser( data )
      navigate(`play/${data.gameId}`)

      socket.on("message", data => {
        console.log( data.content )
      })
    })
  }, [socket])
  

  return (
    <ChessProvider>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="play/" element={ <Menu/> }/>
        <Route path="play/:id" element={ <Play/> }/>
      </Routes>
    </ChessProvider>
    
    
  )
}

export default App
