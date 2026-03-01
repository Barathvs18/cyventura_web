import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isRegister, setIsRegister] = useState(location.state?.isRegister || false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Update state if location changes
    useEffect(() => {
        if (location.state?.isRegister) {
            setIsRegister(true);
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const url = isRegister
            ? 'http://localhost:8000/api/auth/register'
            : 'http://localhost:8000/api/auth/login';

        const payload = isRegister
            ? { name: formData.name, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMsg = data.detail || 'An error occurred';
                if (Array.isArray(data.detail)) {
                    errorMsg = data.detail.map(d => d.msg).join(', ');
                }
                throw new Error(errorMsg);
            }

            if (isRegister) {
                setSuccess('Registration successful! Logging you in...');
                // automatically log in after registration to improve UX
                const loginRes = await fetch('http://localhost:8000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password }),
                });
                if (loginRes.ok) {
                    const loginData = await loginRes.json();
                    localStorage.setItem('token', loginData.access_token);
                    navigate('/dashboard');
                } else {
                    setIsRegister(false);
                    setFormData({ name: '', email: '', password: '' });
                }
            } else {
                setSuccess('Login successful!');
                localStorage.setItem('token', data.access_token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                        Member <span style={{ color: 'var(--red)' }}>{isRegister ? 'Register' : 'Login'}</span>
                    </h2>
                    <div className="red-line mt-4 mx-auto" />
                </div>

                {/* Card */}
                <div
                    className="card-dark rounded-lg p-8 reveal"
                    style={{ border: '1px solid var(--gray-700)' }}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {error && (
                            <div className="p-3 text-sm rounded bg-red-900/30 text-red-500 border border-red-500/30">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 text-sm rounded bg-green-900/30 text-green-500 border border-green-500/30">
                                {success}
                            </div>
                        )}

                        {/* Name (Only for Register) */}
                        {isRegister && (
                            <div>
                                <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-dark w-full rounded-sm px-4 py-3 text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

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
                        {!isRegister && (
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
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-glow rounded-sm py-3.5 text-sm font-bold tracking-wider w-full mt-1 disabled:opacity-50"
                        >
                            {loading ? 'PROCESSING...' : isRegister ? 'REGISTER' : 'LOG IN'}
                        </button>
                    </form>

                    {/* Join link */}
                    <div className="mt-6 text-center text-sm" style={{ color: 'var(--gray-500)' }}>
                        {isRegister ? 'Already a member? ' : 'Not a member yet? '}
                        <button
                            type="button"
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError(null);
                                setSuccess(null);
                            }}
                            className="font-semibold bg-transparent border-none cursor-pointer"
                            style={{ color: 'var(--red)' }}
                        >
                            {isRegister ? 'Log in here' : 'Join Cyventura'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

