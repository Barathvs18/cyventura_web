import { useEffect } from 'react';
import Hero from '../Components/Hero';
import ScrollAnimation from '../Components/scrollAnimation';
import About from '../Components/About';
import Members from '../Components/Members';
import Events from '../Components/Events';
import Contact from '../Components/Contact';
import DottedSurface from '../Components/Background';
import Footer from '../Components/Footer';

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
        {/* <DottedSurface /> */}
                <div id="home"><Hero /></div>
                <div id="about">
                
                    <About />
                </div>
                {/* <div id="events">
                    <ScrollAnimation titleComponent={<h1 className="title" style={{ textAlign: "center", color: "white" }}>Events</h1>}>
                        <Events />
                    </ScrollAnimation>
                </div> */}
                <div id="members">
                    
                        <Members />
                 
                </div>
                {/* <div id="contact"><Contact /></div> */}
                <Footer />
            </main>
        </>
    );
}
