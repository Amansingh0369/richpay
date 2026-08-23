import Header from './components/Header'
import Hero from './components/Hero'
import StatsBand from './components/StatsBand'
import Process from './components/Process'
import Why from './components/Why'
import Products from './components/Products'
import Calculator from './components/Calculator'
import Trust from './components/Trust'
import Testimonials from './components/Testimonials'
import About from './components/About'
import MobileApp from './components/MobileApp'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <StatsBand />
        <Process />
        <Why />
        <Products />
        <Calculator />
        <Trust />
        <Testimonials />
        <About />
        <MobileApp />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
