import { useEffect } from 'react';
import Hero from '../Components/Hero';
import ScrollAnimation from '../Components/scrollAnimation';
import About from '../Components/About';
import Events from '../Components/Events';
import Members from '../Components/Members';
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
                
                <div id="events" style={{ paddingTop: '40px' }}>
                    <hr
                      style={{
                        width: "calc(100% - 40px)",
                        maxWidth: "1520px",
                        height: "2px",
                        backgroundColor: "#f8f3f3ff",
                        border: "none",
                        margin: "0 auto 30px auto",
                        opacity: "0.1"
                      }}
                    />
                  
                        <div className="dossier-header text-center">
                            <span className="dossier-eyebrow">A C T I V I T I E S</span>
                            <h2 className="dossier-main-title">Our <span className="text-red">Events</span></h2>
                        </div>
                   
                        <Events />
                </div>

                <div id="members">

                    <Members />

                </div>
                {/* <div id="contact"><Contact /></div> */}
                <Footer />
            </main>
        </>
    );
}
