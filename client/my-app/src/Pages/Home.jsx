import { useEffect } from 'react';
import Hero from '../Components/Hero';
import About from '../Components/About';
import Explore from '../Components/Explore';
import Events from '../Components/Events';
import Contact from '../Components/Contact';

export default function Home() {
    // We can just keep the reveal hook here since it applies to home sections
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

    return (
        <>
            <main>
                <Hero />
                <About />
                <Explore />
                <Events />
                <Contact />
            </main>
        </>
    );
}
