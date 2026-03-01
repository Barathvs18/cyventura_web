import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function IntroOverlay({ onComplete }) {
    const containerRef = useRef(null);
    const logoRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: onComplete
                });
            }
        });

        // 1. Logo fades/scales in
        tl.fromTo(logoRef.current,
            { scale: 0, opacity: 0, rotation: -90 },
            { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: "elastic.out(1, 0.7)" }
        )
            // 2. Expand the text container width to reveal the text, smoothly pushing the logo left
            .to(textRef.current, {
                width: "350px", // Enough width for CYVENTURA
                opacity: 1,
                marginLeft: "24px", // Act as a gap
                duration: 1.2,
                ease: "power3.inOut"
            }, "+=0.3")
            // 3. Keep them on screen briefly before fading out
            .to({}, { duration: 1.0 });

    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent pointer-events-none"
        >
            <div className="flex items-center justify-center">
                {/* Logo wrapper */}
                <div ref={logoRef} className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <div
                        className="absolute inset-0 rotate-45 border-[4px] border-[var(--red)] shadow-[0_0_15px_rgba(0,168,255,0.5)]"
                        style={{ borderRadius: '10px' }}
                    />
                    <span className="relative text-white font-black text-2xl tracking-widest z-10">CV</span>
                </div>

                {/* Text - width will animate from 0 */}
                <div
                    ref={textRef}
                    className="text-white font-extrabold text-5xl tracking-[0.1em] overflow-hidden whitespace-nowrap w-0 opacity-0 ml-0 relative mt-1"
                >
                    CY<span style={{ color: 'var(--red)' }}>VENTURA</span>
                </div>
            </div>
        </div>
    );
}
