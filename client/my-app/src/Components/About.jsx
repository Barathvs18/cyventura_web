import { useEffect, useRef, useState } from 'react';

/* ─── Animated counter hook ──────────────────────────────────── */
function useCounter(target, duration = 1800) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let started = false;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started) {
                started = true;
                let start = 0;
                const step = Math.ceil(target / (duration / 16));
                const timer = setInterval(() => {
                    start = Math.min(start + step, target);
                    setCount(start);
                    if (start >= target) clearInterval(timer);
                }, 16);
            }
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [target, duration]);

    return [count, ref];
}

/* ─────────────────────────────────────────────────────────────── */

export default function About() {
    const [count1, ref1] = useCounter(150);
    const [count2, ref2] = useCounter(30);
    const [count3, ref3] = useCounter(20);

    const stats = [
        { value: count1, label: 'Members', suffix: '+', ref: ref1 },
        { value: count2, label: 'Projects', suffix: '+', ref: ref2 },
        { value: count3, label: 'Events', suffix: '+', ref: ref3 },
    ];

    const pillars = [
        {
            icon: '⚡',
            title: 'Innovation',
            desc: 'We encourage bold ideas. Members collaborate on real-world projects that push boundaries and challenge norms.',
        },
        {
            icon: '🔗',
            title: 'Community',
            desc: 'A tight-knit ecosystem of peers, mentors, and industry contacts that help each other grow every day.',
        },
        {
            icon: '🎯',
            title: 'Purpose',
            desc: 'Every initiative we undertake is driven by a clear mission — building skills that matter and leaders who inspire.',
        },
    ];

    return (
        <section id="about" className="py-28 px-6 relative" style={{ background: 'var(--gray-900)' }}>
            {/* Decorative left bar */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ background: 'linear-gradient(to bottom, transparent, var(--red), transparent)' }}
            />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-16 reveal">
                    <p className="section-eyebrow mb-3">Who We Are</p>
                    <h2 className="font-extrabold mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                        About <span style={{ color: 'var(--red)' }}>Cyventura</span>
                    </h2>
                    <div className="red-line" />
                    <p className="text-[var(--gray-300)] max-w-2xl mt-5 leading-relaxed text-lg">
                        Cyventura is a student-led tech and innovation club dedicated to transforming
                        passionate learners into tech leaders. We build projects, host events, and foster
                        a culture of continuous learning and collaboration.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-20 max-w-xl">
                    {stats.map(({ value, label, suffix, ref }, i) => (
                        <div key={label} ref={ref} className={`reveal delay-${(i + 1) * 100 + 100}`}>
                            <div
                                className="text-4xl font-black"
                                style={{ color: 'var(--red)', fontVariantNumeric: 'tabular-nums' }}
                            >
                                {value}{suffix}
                            </div>
                            <div className="text-[var(--gray-300)] text-sm mt-1 tracking-wider uppercase">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pillars */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pillars.map(({ icon, title, desc }, i) => (
                        <div
                            key={title}
                            className={`card-dark rounded-lg p-7 reveal delay-${(i + 1) * 100 + 100}`}
                        >
                            <div
                                className="w-12 h-12 rounded-md flex items-center justify-center text-2xl mb-5"
                                style={{
                                    background: 'rgba(232,0,13,0.1)',
                                    border: '1px solid rgba(232,0,13,0.3)',
                                }}
                            >
                                {icon}
                            </div>
                            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--white)' }}>
                                {title}
                            </h3>
                            <p className="text-[var(--gray-300)] text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
