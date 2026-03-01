import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hyperspeed from './Hyperspeed';
import IntroOverlay from './IntroOverlay';

const hyperspeedOptions = {
    "distortion": "turbulentDistortion",
    "length": 400,
    "roadWidth": 10,
    "islandWidth": 2,
    "lanesPerRoad": 3,
    "fov": 90,
    "fovSpeedUp": 150,
    "speedUp": 2,
    "carLightsFade": 0.4,
    "totalSideLightSticks": 20,
    "lightPairsPerRoadWay": 40,
    "shoulderLinesWidthPercentage": 0.05,
    "brokenLinesWidthPercentage": 0.1,
    "brokenLinesLengthPercentage": 0.5,
    "lightStickWidth": [0.12, 0.5],
    "lightStickHeight": [1.3, 1.7],
    "movingAwaySpeed": [60, 80],
    "movingCloserSpeed": [-120, -160],
    "carLightsLength": [12, 80],
    "carLightsRadius": [0.05, 0.14],
    "carWidthPercentage": [0.3, 0.5],
    "carShiftX": [-0.8, 0.8],
    "carFloorSeparation": [0, 5],
    "colors": {
        "roadColor": 0x080808,
        "islandColor": 0x0a0a0a,
        "background": 0x000000,
        "shoulderLines": 0x131313,
        "brokenLines": 0x131313,
        "leftCars": [0x00a8ff, 0x005b8a, 0x33ccff],
        "rightCars": [0x444444, 0x777777, 0x999999],
        "sticks": 0x00a8ff
    }
};

export default function Hero() {
    const navigate = useNavigate();
    const [typed, setTyped] = useState('');
    const words = ['Innovate.', 'Explore.', 'Connect.', 'Lead.'];
    const wordIdx = useRef(0);
    const charIdx = useRef(0);
    const deleting = useRef(false);

    const [introDone, setIntroDone] = useState(() => {
        return sessionStorage.getItem('cyventura_intro') === 'true';
    });

    useEffect(() => {
        if (!introDone) return; // Only start typing after intro

        const tick = () => {
            const word = words[wordIdx.current];
            if (!deleting.current) {
                charIdx.current++;
                setTyped(word.slice(0, charIdx.current));
                if (charIdx.current === word.length) {
                    deleting.current = true;
                    setTimeout(tick, 1400);
                    return;
                }
            } else {
                charIdx.current--;
                setTyped(word.slice(0, charIdx.current));
                if (charIdx.current === 0) {
                    deleting.current = false;
                    wordIdx.current = (wordIdx.current + 1) % words.length;
                }
            }
            setTimeout(tick, deleting.current ? 55 : 90);
        };
        const t = setTimeout(tick, 300);
        return () => clearTimeout(t);
    }, [introDone]);

    return (
        <>
            {!introDone && (
                <IntroOverlay onComplete={() => {
                    setIntroDone(true);
                    sessionStorage.setItem('cyventura_intro', 'true');
                }} />
            )}

            <section
                id="home"
                className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grid-bg"
                style={{ background: 'var(--black)' }}
            >
                {/* Hyperspeed Background */}
                <div className="absolute inset-0 pointer-events-auto">
                    <Hyperspeed effectOptions={hyperspeedOptions} />
                </div>

                <div className={`transition-opacity duration-1000 w-full h-full absolute inset-0 pointer-events-none ${introDone ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Noise */}
                    <div className="noise-overlay" />

                    {/* Radial glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,168,255,0.12) 0%, transparent 65%)',
                        }}
                    />

                    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pb-32">

                        {/* Floating decorative rings */}
                        <div className="absolute top-24 right-16 w-56 h-56 rounded-full border border-[var(--red)] opacity-10 anim-spin-slow" />
                        <div className="absolute bottom-24 left-16 w-32 h-32 rounded-full border border-[var(--gray-700)] opacity-20 anim-float" />
                        <div
                            className="absolute top-40 left-1/4 w-4 h-4 rounded-full anim-float delay-300"
                            style={{ background: 'var(--red)', boxShadow: '0 0 16px var(--red)', opacity: 0.7 }}
                        />

                        {/* Content */}
                        <div className={`relative z-10 text-center max-w-4xl mx-auto px-6 ${introDone ? 'pointer-events-auto' : 'pointer-events-none'}`}>

                            <p className="section-eyebrow mb-5 anim-fade-up">
                                Welcome to Cyventura
                            </p>

                            <h1
                                className="font-extrabold leading-none mb-6 anim-fade-up delay-200"
                                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
                            >
                                <span style={{ color: 'var(--white)' }}>We </span>
                                <span style={{ color: 'var(--red)', textShadow: '0 0 30px rgba(0,168,255,0.5)' }}>
                                    {typed}
                                </span>
                                <span
                                    className="inline-block w-[3px] h-[0.85em] ml-1 align-middle"
                                    style={{ background: 'var(--red)', animation: 'blink 0.9s step-end infinite' }}
                                />
                            </h1>

                            <p
                                className="text-[var(--gray-300)] max-w-xl mx-auto leading-relaxed mb-10 anim-fade-up delay-400"
                                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}
                            >
                                The hub for curious minds — where technology meets ambition. Join a community that
                                builds, breaks, and transforms the future.
                            </p>
                            <button
                                onClick={() => navigate('/auth', { state: { isRegister: true } })}
                                className="bg-transparent text-white font-bold px-20 py-6 rounded-full border-[3px] border-[var(--red)] hover:bg-[var(--red)] hover:shadow-[0_0_30px_var(--red-glow)] transition-all duration-300 cursor-pointer text-xl tracking-widest uppercase"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 anim-fade-in delay-800 transition-opacity duration-1000 ${introDone ? 'opacity-100' : 'opacity-0'}`}>

                        <div className="w-[1px] h-10 relative overflow-hidden" style={{ background: 'var(--gray-700)' }}>
                            <div
                                className="absolute top-0 left-0 w-full h-1/2"
                                style={{ background: 'var(--red)', animation: 'scan-line 1.5s linear infinite' }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
