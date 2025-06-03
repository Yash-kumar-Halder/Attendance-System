import './Styles/Global.css'
import './Styles/Utils.css'
import Layout from './components/layout/Layout'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import React, { useState } from 'react'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Classes from './components/pages/Classes'
import Dashboard from './components/pages/Dashboard'
import "./Styles/Root.css"
import Header from './components/layout/Header'
import LandingPage from './components/pages/LandingPage'
import SidebarLayout from './components/layout/SidebarLayout'
import Leaderboard from './components/pages/Leaderboard'


function App() {

  const [isDarkMode, setIsDarkMode] = useState(true);

  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<><Layout /></>}  >
            <Route index element={<LandingPage />} ></Route>
            <Route path='login' element={<Login />} ></Route>
            <Route path='signup' element={<Signup />} ></Route>
            <Route path='dashboard' element={<Dashboard />} ></Route>
            <Route path='leaderboard' element={<Leaderboard />} ></Route>
            <Route path='classes' element={<Classes />} ></Route>
          </Route>
          {/* <Route path='/' element={<><SidebarLayout /></>}  >
            
          </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
