import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import GiftCards from './pages/GiftCards'
import About from './pages/About'
import Exchange from './pages/Exchange'
import Rates from './pages/Rates'
import ForgotPassword from './pages/ForgotPassword'

// Dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout'
import TransactionHistory from './pages/dashboard/TransactionHistory'
import SellCrypto from './pages/dashboard/SellCrypto'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import BankAccounts from './pages/dashboard/BankAccounts'
import Support from './pages/dashboard/Support'

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
    <Route path="/forgot-password" element={<ForgotPassword />} />
    
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<DashboardOverview />} />
      <Route path="txn" element={<TransactionHistory />} />
      <Route path="trade" element={<SellCrypto />} />
      <Route path="bank" element={<BankAccounts />} />
      <Route path="support" element={<Support />} />
    </Route>
   </Routes>
    </>
  )
}

export default App