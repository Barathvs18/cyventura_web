import MagicBento from './MagicBento';

const events = [
    {
        date: 'MAR 15',
        type: 'Hackathon',
        title: '24h Build Challenge',
        desc: 'Build anything in 24 hours. Prizes, mentors, and chaos. Solo or team up to 4.',
        status: 'upcoming',
        seats: 40,
    },
    {
        date: 'MAR 28',
        type: 'Workshop',
        title: 'Breaking Web Security',
        desc: 'Hands-on ethical hacking covering OWASP Top 10 with live CTF tasks.',
        status: 'upcoming',
        seats: 20,
    },
    {
        date: 'APR 05',
        type: 'Talk',
        title: 'Career in Big Tech',
        desc: 'Panel discussion with engineers from top tech companies on breaking in and leveling up.',
        status: 'upcoming',
        seats: null,
    },
    {
        date: 'FEB 10',
        type: 'Workshop',
        title: 'Intro to Machine Learning',
        desc: 'A beginner-friendly session on ML fundamentals, tools, and hands-on exercises.',
        status: 'past',
        seats: null,
    },
];

export default function Events() {
    return (
        <section id="events" className="py-28 px-6 relative" style={{ background: 'var(--gray-900)' }}>
            {/* Decorative right bar */}
            <div
                className="absolute right-0 top-0 bottom-0 w-1"
                style={{ background: 'linear-gradient(to bottom, transparent, var(--red), transparent)' }}
            />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-14 reveal">
                    <p className="section-eyebrow mb-3">What's Happening</p>
                    <h2 className="font-extrabold" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                        <span style={{ color: 'var(--red)' }}>Events</span> &amp; Programs
                    </h2>
                    <div className="red-line mt-4" />
                </div>

                {/* Events List with MagicBento */}
                <div className="mt-5 relative z-10 w-full mb-10">
                    <MagicBento
                        cards={events.map(e => ({
                            label: e.type,
                            title: e.title,
                            description: e.desc,
                            className: e.status === 'past' ? 'opacity-60 saturate-50' : '',
                            content: (
                                <div className="flex flex-col h-full justify-between mt-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-md font-extrabold text-center"
                                            style={{
                                                background: e.status === 'upcoming' ? 'var(--red)' : 'var(--gray-700)',
                                                color: 'var(--white)',
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            <span className="text-[10px] tracking-wide">{e.date.split(' ')[0]}</span>
                                            <span className="text-xl font-black">{e.date.split(' ')[1]}</span>
                                        </div>
                                        {e.status === 'past' && <span className="text-xs text-[var(--gray-500)] uppercase">Completed</span>}
                                    </div>

                                    <div className="mt-6 shrink-0 z-10">
                                        {e.status === 'upcoming' ? (
                                            <button className="btn-glow w-full py-3 text-sm whitespace-nowrap !px-4 hover:shadow-[0_0_15px_var(--red-glow)] hover:-translate-y-1 transition-all">
                                                {e.seats ? `Register (${e.seats} seats)` : 'Register Free'}
                                            </button>
                                        ) : (
                                            <button className="btn-ghost w-full py-3 text-sm whitespace-nowrap !px-4 hover:shadow-none hover:border-[var(--gray-500)] hover:text-white cursor-not-allowed">
                                                View Recap
                                            </button>
                                        )}
                                    </div>
                                </div>
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
                        particleCount={10}
                        glowColor="0, 168, 255"
                        disableAnimations={false}
                        enableGlowingBorder={true}
                    />
                </div>

                <div className="mt-10 text-center reveal">
                    <button className="btn-ghost rounded-sm px-8 py-3 text-sm font-semibold">
                        View All Events →
                    </button>
                </div>
            </div>
        </section>
    );
}
