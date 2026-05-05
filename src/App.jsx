import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Signup from './pages/signup/Signup'

const App = () => {
  return (
    <>
   <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/signup" element={<Signup />} />
   </Routes>
    </>
  )
}

export default App