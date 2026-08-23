import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* Unknown paths fall back to the landing page rather than a dead end */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
