import { useEffect } from 'react';

import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import About from './Components/About';
import Explore from './Components/Explore';
import Events from './Components/Events';
import Contact from './Components/Contact';
import Login from './Components/Login';
import Footer from './Components/Footer';

/* ─── Global Intersection Observer for scroll-reveal ─────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── App Root ───────────────────────────────────────────────── */
export default function App() {
  useReveal();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Explore />
        <Events />
        <Contact />
        <Login />
      </main>
      <Footer />
    </>
  );
}
