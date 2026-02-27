import { useState } from 'react';

const contactInfo = [
    { icon: '📧', label: 'Email', value: 'hello@cyventura.club' },
    { icon: '📍', label: 'Location', value: 'University Campus, Tech Block' },
    { icon: '🗓️', label: 'Active', value: 'Mon – Fri, 10:00 AM – 6:00 PM' },
];

const socials = [
    { icon: '🐙', label: 'GitHub', href: '#' },
    { icon: '💼', label: 'LinkedIn', href: '#' },
    { icon: '🐦', label: 'Twitter', href: '#' },
    { icon: '📸', label: 'Instagram', href: '#' },
];

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    return (
        <section
            id="contact"
            className="py-28 px-6 relative overflow-hidden"
            style={{ background: 'var(--black)' }}
        >
            {/* Big decorative watermark */}
            <div
                className="absolute -left-4 top-1/3 font-black opacity-[0.03] pointer-events-none select-none"
                style={{ fontSize: 'clamp(6rem, 15vw, 14rem)', color: 'var(--red)', lineHeight: 1 }}
            >
                CONTACT
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-14 reveal">
                    <p className="section-eyebrow mb-3">Get In Touch</p>
                    <h2 className="font-extrabold" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                        Contact <span style={{ color: 'var(--red)' }}>Us</span>
                    </h2>
                    <div className="red-line mt-4" />
                </div>

                <div className="grid lg:grid-cols-2 gap-14 items-start">
                    {/* ── Left: Info + Socials ─────────────────────────── */}
                    <div className="reveal-left">
                        <p className="text-[var(--gray-300)] text-lg leading-relaxed mb-8">
                            Have questions? Want to collaborate or just say hi? We'd love to hear from you.
                            Reach out through the form or find us on social media.
                        </p>

                        <div className="flex flex-col gap-5 mb-10">
                            {contactInfo.map(({ icon, label, value }) => (
                                <div key={label} className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                                        style={{
                                            background: 'rgba(232,0,13,0.1)',
                                            border: '1px solid rgba(232,0,13,0.3)',
                                        }}
                                    >
                                        {icon}
                                    </div>
                                    <div>
                                        <div className="text-[var(--gray-500)] text-xs uppercase tracking-wider">
                                            {label}
                                        </div>
                                        <div className="text-white text-sm font-medium">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Socials */}
                        <div className="flex gap-3">
                            {socials.map(({ icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    title={label}
                                    className="w-10 h-10 rounded-md flex items-center justify-center card-dark transition-all duration-300"
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Form ──────────────────────────────────── */}
                    <div className="reveal-right">
                        {sent ? (
                            <div
                                className="card-dark rounded-lg p-10 text-center"
                                style={{ border: '1px solid rgba(232,0,13,0.4)' }}
                            >
                                <div
                                    className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl"
                                    style={{
                                        background: 'rgba(232,0,13,0.1)',
                                        border: '2px solid var(--red)',
                                    }}
                                >
                                    ✓
                                </div>
                                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-[var(--gray-300)] text-sm">
                                    Thanks for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => {
                                        setSent(false);
                                        setForm({ name: '', email: '', message: '' });
                                    }}
                                    className="btn-ghost rounded-sm px-6 py-2.5 text-sm mt-6"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="card-dark rounded-lg p-8 flex flex-col gap-5"
                            >
                                <div>
                                    <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="input-dark w-full rounded-sm px-4 py-3 text-sm"
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="input-dark w-full rounded-sm px-4 py-3 text-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="input-dark w-full rounded-sm px-4 py-3 text-sm resize-none"
                                        placeholder="Tell us what's on your mind..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-glow rounded-sm py-3.5 text-sm font-bold tracking-wider w-full"
                                >
                                    {loading ? 'Sending…' : 'SEND MESSAGE'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
