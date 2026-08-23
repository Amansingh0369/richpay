import LegalPage from '../components/LegalPage'
import { termsAndConditions } from '../data/legal'

export default function Terms() {
  return <LegalPage doc={termsAndConditions} />
}
