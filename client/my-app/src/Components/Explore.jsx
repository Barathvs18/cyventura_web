import MagicBento from './MagicBento';

const domains = [
    {
        tag: 'Development',
        title: 'Web & App Dev',
        desc: 'Build full-stack applications using cutting-edge frameworks and cloud platforms through guided workshops.',
        gradient: 'linear-gradient(135deg, rgba(0,168,255,0.2), transparent)',
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
        gradient: 'linear-gradient(135deg, rgba(0,168,255,0.15), transparent)',
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
        gradient: 'linear-gradient(135deg, rgba(0,168,255,0.12), transparent)',
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

                {/* Magic Bento Cards Grid */}
                <div className="mt-5 relative z-10 w-full">
                    <MagicBento
                        cards={domains.map(d => ({
                            title: d.title,
                            description: d.desc,
                            label: d.tag,
                            content: (
                                <button
                                    className="mt-6 text-[var(--red)] text-sm font-semibold flex items-center gap-1.5 group/btn cursor-pointer w-fit"
                                    style={{ background: 'none', border: 'none' }}
                                >
                                    Learn More
                                    <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                                </button>
                            )
                        }))}
                        textAutoHide={false}
                        enableStars={true}
                        enableSpotlight={true}
                        enableBorderGlow={true}
                        enableTilt={true}
                        enableMagnetism={true}
                        clickEffect={true}
                        spotlightRadius={400}
                        particleCount={14}
                        glowColor="0, 168, 255"
                        disableAnimations={false}
                    />
                </div>
            </div>
        </section>
    );
}
