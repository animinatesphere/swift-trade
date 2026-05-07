import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import GiftCards from './pages/GiftCards'
import About from './pages/About'
import Exchange from './pages/Exchange'
import Rates from './pages/Rates'

const App = () => {
  return (
    <>
   <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/signup" element={<Auth initialPage="register" />} />
    <Route path="/login" element={<Auth initialPage="login" />} />
    <Route path="/gift-cards" element={<GiftCards />} />
    <Route path="/about" element={<About />} />
    <Route path="/exchange" element={<Exchange />} />
    <Route path="/rates" element={<Rates />} />
   </Routes>
    </>
  )
}

export default App