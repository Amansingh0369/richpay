import LegalPage from '../components/LegalPage'
import { privacyPolicy } from '../data/legal'

export default function PrivacyPolicy() {
  return <LegalPage doc={privacyPolicy} />
}
