import { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Login functionality coming soon!');
    };

    return (
        <section id="login" className="py-28 px-6 relative" style={{ background: 'var(--gray-900)' }}>
            <div className="noise-overlay" />

            {/* Radial glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(232,0,13,0.07) 0%, transparent 65%)',
                }}
            />

            <div className="max-w-md mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-10 reveal">
                    <p className="section-eyebrow mb-3">Members Area</p>
                    <h2 className="font-extrabold" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                        Member <span style={{ color: 'var(--red)' }}>Login</span>
                    </h2>
                    <div className="red-line mt-4 mx-auto" />
                </div>

                {/* Card */}
                <div
                    className="card-dark rounded-lg p-8 reveal"
                    style={{ border: '1px solid var(--gray-700)' }}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-dark w-full rounded-sm px-4 py-3 text-sm"
                                placeholder="member@cyventura.club"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <input
                                type={showPass ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-dark w-full rounded-sm px-4 py-3 pr-16 text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-[38px] text-[var(--gray-500)] hover:text-white
                           transition-colors bg-transparent border-none cursor-pointer text-xs tracking-wider"
                            >
                                {showPass ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>

                        {/* Options */}
                        <div className="flex justify-between items-center text-xs text-[var(--gray-500)]">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" className="accent-red-600" />
                                Remember me
                            </label>
                            <button
                                type="button"
                                className="hover:text-[var(--red)] transition-colors bg-transparent border-none cursor-pointer text-xs"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn-glow rounded-sm py-3.5 text-sm font-bold tracking-wider w-full mt-1"
                        >
                            LOG IN
                        </button>
                    </form>

                    {/* Join link */}
                    <div className="mt-6 text-center text-sm" style={{ color: 'var(--gray-500)' }}>
                        Not a member yet?{' '}
                        <button
                            type="button"
                            onClick={() =>
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                            }
                            className="font-semibold bg-transparent border-none cursor-pointer"
                            style={{ color: 'var(--red)' }}
                        >
                            Join Cyventura
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
