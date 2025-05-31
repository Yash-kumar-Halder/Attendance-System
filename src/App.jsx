import './Styles/Global.css'
import './Styles/Utils.css'
import Layout from './components/layout/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/pages/LandingPage'
import { useState } from 'react'
import Login from './components/pages/Login'
import Header from './components/layout/Header'


function App() {

  const [isDarkMode, setIsDarkMode] = useState(true);

  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<Layout />}  >
            {/* <Route index element={<LandingPage />} ></Route> */}
          </Route>
          <Route path='/' element={<><Header /> <LandingPage /></>}  ></Route>
          <Route path='/login' element={<Login />} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
