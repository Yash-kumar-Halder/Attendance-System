import './Styles/Global.css'
import './Styles/Utils.css'
import Layout from './components/layout/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Classes from './components/pages/ActiveClasses'
import Dashboard from './components/pages/Dashboard'
import "./Styles/Root.css"
import LandingPage from './components/pages/LandingPage'
import Leaderboard from './components/pages/Leaderboard'
import ScheduleClasses from './components/pages/ScheduleClasses'
import Subject from './components/pages/Subject'
import AllStudents from './components/pages/AllStudents'
import ClassHistory from './components/pages/ClassHistory'
import Attendance from './components/pages/Attendance'


function App() {

  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<><Layout /></>}  >
            <Route path='/' element={<LandingPage />} ></Route>
            <Route path='login' element={<Login />} ></Route>
            <Route path='signup' element={<Signup />} ></Route>
            <Route path='dashboard' element={<Dashboard />} ></Route>
            <Route path='leaderboard' element={<Leaderboard />} ></Route>
            <Route path='classes' element={<Classes />} ></Route>
            <Route path='all-students' element={<AllStudents />} ></Route>
            <Route path='schedule-classes' element={<ScheduleClasses />} ></Route>
            <Route path='add-subject' element={<Subject />} ></Route>
            <Route path='class-history' element={<ClassHistory />} ></Route>
            <Route path='attendance' element={<Attendance />} ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
