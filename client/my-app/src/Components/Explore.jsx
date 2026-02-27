const domains = [
    {
        tag: 'Development',
        title: 'Web & App Dev',
        desc: 'Build full-stack applications using cutting-edge frameworks and cloud platforms through guided workshops.',
        gradient: 'linear-gradient(135deg, rgba(232,0,13,0.2), transparent)',
    },
    {
        tag: 'Security',
        title: 'Cyber & CTFs',
        desc: 'Learn ethical hacking, participate in Capture the Flag competitions, and master offensive security.',
        gradient: 'linear-gradient(135deg, rgba(100,100,100,0.2), transparent)',
    },
    {
        tag: 'Intelligence',
        title: 'AI / ML Projects',
        desc: 'Prototype machine learning models and explore artificial intelligence applied to real problems.',
        gradient: 'linear-gradient(135deg, rgba(232,0,13,0.15), transparent)',
    },
    {
        tag: 'Hardware',
        title: 'IoT & Robotics',
        desc: 'Design embedded systems, code micro-controllers, and build hardware projects in our maker lab.',
        gradient: 'linear-gradient(135deg, rgba(80,80,80,0.2), transparent)',
    },
    {
        tag: 'Research',
        title: 'Open Source',
        desc: 'Contribute to real open source repositories and get guidance from experienced contributors.',
        gradient: 'linear-gradient(135deg, rgba(232,0,13,0.12), transparent)',
    },
    {
        tag: 'Design',
        title: 'UI / UX & Brand',
        desc: 'Learn design thinking, user research, and create polished interfaces that look and feel exceptional.',
        gradient: 'linear-gradient(135deg, rgba(60,60,60,0.2), transparent)',
    },
];

export default function Explore() {
    return (
        <section
            id="explore"
            className="py-28 px-6 relative overflow-hidden"
            style={{ background: 'var(--black)' }}
        >
            {/* Big decorative watermark */}
            <div
                className="absolute -right-8 top-1/4 font-black opacity-[0.03] pointer-events-none select-none"
                style={{ fontSize: 'clamp(8rem, 18vw, 16rem)', color: 'var(--red)', lineHeight: 1 }}
            >
                EXPLORE
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-14 reveal">
                    <p className="section-eyebrow mb-3">What We Do</p>
                    <h2 className="font-extrabold" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                        Explore <span style={{ color: 'var(--red)' }}>Domains</span>
                    </h2>
                    <div className="red-line mt-4" />
                </div>

                {/* Cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {domains.map(({ tag, title, desc, gradient }, i) => (
                        <div
                            key={title}
                            className={`card-dark rounded-lg p-7 relative overflow-hidden group reveal delay-${(i % 3 + 1) * 100 + 100}`}
                        >
                            {/* Hover gradient overlay */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: gradient }}
                            />

                            <div className="relative z-10">
                                {/* Tag */}
                                <span
                                    className="text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-1 rounded-sm mb-4 inline-block"
                                    style={{
                                        color: 'var(--red)',
                                        border: '1px solid rgba(232,0,13,0.4)',
                                        background: 'rgba(232,0,13,0.07)',
                                    }}
                                >
                                    {tag}
                                </span>

                                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--white)' }}>
                                    {title}
                                </h3>
                                <p className="text-[var(--gray-300)] text-sm leading-relaxed">{desc}</p>

                                <button
                                    className="mt-5 text-[var(--red)] text-sm font-semibold flex items-center gap-1.5 group/btn cursor-pointer"
                                    style={{ background: 'none', border: 'none' }}
                                >
                                    Learn More
                                    <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
