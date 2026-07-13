import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CinematicLoader from './components/CinematicLoader'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import GiftCards from './pages/GiftCards'
import About from './pages/About'
import Exchange from './pages/Exchange'
import Rates from './pages/Rates'
import ForgotPassword from './pages/ForgotPassword'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'
import AMLPolicy from './pages/legal/AMLPolicy'
import CookiePolicy from './pages/legal/CookiePolicy'

// Dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout'
import TransactionHistory from './pages/dashboard/TransactionHistory'
import SellCrypto from './pages/dashboard/SellCrypto'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import BankAccounts from './pages/dashboard/BankAccounts'
import Support from './pages/dashboard/Support'
import Withdraw from './pages/dashboard/Withdraw'
import Settings from './pages/dashboard/Settings'
import GiftCardsDashboard from './pages/dashboard/GiftCards'
import KYC from './pages/dashboard/KYC'
import Notifications from './pages/dashboard/Notifications'

const App = () => {
  const [showLoader, setShowLoader] = useState(() => {
    return !sessionStorage.getItem('loader-played')
  })

  const handleLoaderComplete = () => {
    sessionStorage.setItem('loader-played', 'true')
    setShowLoader(false)
  }

  return (
    <>
      {showLoader && <CinematicLoader onComplete={handleLoaderComplete} />}
      <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/register" element={<Auth initialPage="register" />} />
    <Route path="/verify-email" element={<Auth initialPage="register" />} />
    <Route path="/login" element={<Auth initialPage="login" />} />
    <Route path="/gift-cards" element={<GiftCards />} />
    <Route path="/about" element={<About />} />
    <Route path="/exchange" element={<Exchange />} />
    <Route path="/rates" element={<Rates />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/aml-policy" element={<AMLPolicy />} />
    <Route path="/cookie-policy" element={<CookiePolicy />} />
    
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="txn" element={<TransactionHistory />} />
        <Route path="trade" element={<SellCrypto />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="bank" element={<BankAccounts />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<Settings />} />
        <Route path="giftcards" element={<GiftCardsDashboard />} />
        <Route path="kyc" element={<KYC />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Route>
   </Routes>
    </>
  )
}

export default App