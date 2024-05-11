import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './tailwind.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider } from './context/UserProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<App/>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
    
  </React.StrictMode>,
)
