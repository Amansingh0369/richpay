import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import FairPracticeCode from './pages/FairPracticeCode'
import InterestRatePolicy from './pages/InterestRatePolicy'
import Grievance from './pages/Grievance'
import RefundCancellationPolicy from './pages/RefundCancellationPolicy'
import Faq from './pages/Faq'

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/fair-practice-code" element={<FairPracticeCode />} />
        <Route path="/interest-rate-policy" element={<InterestRatePolicy />} />
        <Route path="/refund-cancellation-policy" element={<RefundCancellationPolicy />} />
        <Route path="/grievance" element={<Grievance />} />
        <Route path="/faq" element={<Faq />} />
        {/* Unknown paths fall back to the landing page rather than a dead end */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
