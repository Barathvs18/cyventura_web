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

                {/* Event list */}
                <div className="flex flex-col gap-5">
                    {events.map(({ date, type, title, desc, status, seats }, i) => (
                        <div
                            key={title}
                            className={`card-dark rounded-lg flex flex-col sm:flex-row gap-5 p-6 items-start sm:items-center reveal delay-${(i + 1) * 100}`}
                            style={status === 'past' ? { opacity: 0.5 } : {}}
                        >
                            {/* Date badge */}
                            <div
                                className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-md font-extrabold text-center"
                                style={{
                                    background: status === 'upcoming' ? 'var(--red)' : 'var(--gray-700)',
                                    color: 'var(--white)',
                                    lineHeight: 1.2,
                                }}
                            >
                                <span className="text-[11px] tracking-wide">{date.split(' ')[0]}</span>
                                <span className="text-2xl font-black">{date.split(' ')[1]}</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-wrap gap-2 items-center mb-1">
                                    <span
                                        className="text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
                                        style={{
                                            color: 'var(--red)',
                                            border: '1px solid rgba(232,0,13,0.4)',
                                            background: 'rgba(232,0,13,0.07)',
                                        }}
                                    >
                                        {type}
                                    </span>
                                    {status === 'past' && (
                                        <span className="text-[10px] tracking-wider uppercase text-[var(--gray-500)]">
                                            Completed
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg" style={{ color: 'var(--white)' }}>{title}</h3>
                                <p className="text-[var(--gray-300)] text-sm mt-1">{desc}</p>
                            </div>

                            {/* CTA */}
                            <div className="shrink-0">
                                {status === 'upcoming' ? (
                                    <button className="btn-glow rounded-sm px-5 py-2.5 text-sm whitespace-nowrap">
                                        {seats ? `Register (${seats} seats)` : 'Register Free'}
                                    </button>
                                ) : (
                                    <button className="btn-ghost rounded-sm px-5 py-2.5 text-sm whitespace-nowrap">
                                        View Recap
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
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
