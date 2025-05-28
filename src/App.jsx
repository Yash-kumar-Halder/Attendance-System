import './Styles/Global.css'
import './App.css'
import './Styles/Utils.css'
import Layout from './components/layout/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/pages/LandingPage'
import { useState } from 'react'


function App() {

  const [isDarkMode, setIsDarkMode] = useState(true);

  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}  >
            <Route index element={<LandingPage/>} ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
