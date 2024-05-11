import React, { useContext, useEffect, useState } from 'react'
import Nav from './../components/Nav'
import Controller from './../components/Controller'
import Chess from './../components/Chess'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import UserContext from '../context/UserProvider'

const Play = () => {
  const { id } = useParams()
  const { user } = useContext( UserContext )
  const from = useLocation()

  return (
    user?.gameId 
      ?<main className='grid p-2 gap-2  grid-rows-[50px,92vh,200px] grid-cols-1 md:grid-rows-[50px,92vh] md:grid-cols-[3fr,1fr] h-dvh'>
          <Nav/>
          <Chess gameId={id}/>
          <Controller/>
      </main>
      :<Navigate to='/' state={{from}} replace/>
  )
}

export default Play