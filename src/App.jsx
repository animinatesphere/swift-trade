import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Signup from './pages/signup/Signup'
import GiftCards from './pages/GiftCards'

const App = () => {
  return (
    <>
   <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/gift-cards" element={<GiftCards />} />
   </Routes>
    </>
  )
}

export default App