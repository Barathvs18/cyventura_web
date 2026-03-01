import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const menuRef = useRef(null);
    const [hasToken, setHasToken] = useState(false);
    const [user, setUser] = useState(null);

    const fetchUser = () => {
        const token = localStorage.getItem('token');
        setHasToken(!!token);
        if (token) {
            fetch('http://localhost:8000/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) setUser(data);
                })
                .catch(() => { });
        } else {
            setUser(null);
        }
    };

    // Update hasToken status
    useEffect(() => {
        fetchUser();
    }, [location.pathname]);

    useEffect(() => {
        window.addEventListener('profileUpdated', fetchUser);
        return () => window.removeEventListener('profileUpdated', fetchUser);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Highlight active section (only matters if we are on the home page)
    useEffect(() => {
        if (location.pathname !== '/') return;

        const sections = ['home', 'about', 'explore', 'events', 'contact'];
        const observers = sections.map(id => {
            const el = document.getElementById(id);
            if (!el) return null;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
                { rootMargin: '50%' }
            );
            obs.observe(el);
            return obs;
        });
        return () => observers.forEach(o => o?.disconnect());
    }, [location.pathname]);

    // Added a slight delay when navigating back to root to allow DOM to render before scrolling
    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            setTimeout(() => {
                document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [location.pathname, location.hash]);

    const navLinks = [
        { href: '#about', label: 'About' },
        { href: '#explore', label: 'Explore' },
        { href: '#events', label: 'Events' },
        { href: '#contact', label: 'Contact' },
    ];

    const handleNavClick = (href) => {
        setMenuOpen(false);
        if (location.pathname !== '/') {
            navigate(`/${href}`);
        } else {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleAuthClick = () => {
        setMenuOpen(false);
        if (hasToken) {
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        setMenuOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
        } else {
            document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleJoinClick = () => {
        setMenuOpen(false);
        navigate('/auth', { state: { isRegister: true } });
    };

    return (
        <header
            className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 flex flex-col items-center gap-2 px-4 md:px-8`}
        >
            <div
                className={`w-full max-w-7xl flex items-center justify-between transition-all duration-500 px-6 py-4 rounded-xl border ${scrolled
                    ? 'bg-[#0a0a0a]/95 backdrop-blur-lg border-[var(--gray-800)] border-b-2 border-b-[var(--red)] shadow-[0_10px_40px_rgba(232,0,13,0.15)] py-3'
                    : 'bg-transparent border-transparent'
                    }`}
            >
                {/* Logo - Flex 1 to balance the layout */}
                <div className="flex-1">
                    <a href="/" onClick={handleHomeClick} className="flex items-center gap-3 group w-fit">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div
                                className="absolute inset-0 rotate-45 border-2 border-[var(--red)] transition-transform duration-300 group-hover:rotate-[225deg]"
                                style={{ borderRadius: '4px' }}
                            />
                            <span className="relative text-white font-black text-xs tracking-widest z-10">CV</span>
                        </div>
                        <span className="text-white font-extrabold text-base tracking-wider hidden sm:block">
                            CY<span style={{ color: 'var(--red)' }}>VENTURA</span>
                        </span>
                    </a>
                </div>

                {/* Desktop nav - Centered */}
                <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
                    {navLinks.map(({ href, label }) => (
                        <button
                            key={href}
                            onClick={() => handleNavClick(href)}
                            className={`nav-link bg-transparent border-none cursor-pointer transition-all duration-300 hover:scale-105 ${location.pathname === '/' && activeSection === href.slice(1) ? '!text-white' : 'text-gray-400'
                                }`}
                            style={location.pathname === '/' && activeSection === href.slice(1) ? { color: 'var(--white)' } : {}}
                        >
                            {label}
                            {location.pathname === '/' && activeSection === href.slice(1) && (
                                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)' }} />
                            )}
                        </button>
                    ))}
                </nav>

                {/* CTA - Flex 1 to balance the layout */}
                <div className="hidden md:flex items-center justify-end gap-4 flex-1">
                    {hasToken ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-9 h-9 rounded-full bg-[var(--gray-800)] overflow-hidden border border-[var(--gray-700)] cursor-pointer hover:border-[var(--red)] transition-colors p-0 focus:outline-none"
                                title="Go to Dashboard"
                            >
                                {user?.profile_picture ? (
                                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--gray-500)] text-sm font-bold">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/');
                                    fetchUser();
                                }}
                                className="text-gray-300 hover:text-[var(--red)] transition-colors text-sm font-bold bg-transparent border-none cursor-pointer"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={handleAuthClick}
                                className="text-gray-300 hover:text-white transition-colors text-sm font-medium bg-transparent border-none cursor-pointer"
                            >
                                Log In
                            </button>
                            <button
                                onClick={handleJoinClick}
                                className="btn-glow rounded-full px-6 py-2 text-xs font-bold tracking-wider"
                            >
                                JOIN CLUB
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer border-none bg-transparent"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span
                        className="block h-0.5 w-6 bg-white transition-all duration-300"
                        style={{ transform: menuOpen ? 'rotate(45deg) translate(4px, 5px)' : 'none' }}
                    />
                    <span
                        className="block h-0.5 w-6 bg-white transition-all duration-300"
                        style={{ opacity: menuOpen ? 0 : 1 }}
                    />
                    <span
                        className="block h-0.5 w-6 bg-white transition-all duration-300"
                        style={{ transform: menuOpen ? 'rotate(-45deg) translate(4px, -5px)' : 'none' }}
                    />
                </button>
            </div>

            {/* Mobile menu */}
            <div
                ref={menuRef}
                className="md:hidden overflow-hidden transition-all duration-300 w-full max-w-7xl rounded-xl"
                style={{
                    maxHeight: menuOpen ? '400px' : '0',
                    opacity: menuOpen ? 1 : 0,
                    background: '#0a0a0a',
                    border: menuOpen ? '1px solid var(--gray-800)' : 'none',
                    borderBottom: menuOpen ? '2px solid var(--red)' : 'none'
                }}
            >
                <div className="px-6 py-6 flex flex-col gap-4">
                    {navLinks.map(({ href, label }) => (
                        <button
                            key={href}
                            onClick={() => handleNavClick(href)}
                            className="nav-link text-left text-base bg-transparent border-none cursor-pointer hover:text-[var(--red)] transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                    <div className="flex gap-3 mt-2">
                        {hasToken ? (
                            <>
                                <button onClick={() => {
                                    setMenuOpen(false);
                                    navigate('/dashboard');
                                }} className="btn-ghost rounded-sm px-5 py-2 text-sm flex-1">
                                    Profile
                                </button>
                                <button onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/');
                                    fetchUser();
                                    setMenuOpen(false);
                                }} className="btn-glow rounded-sm px-5 py-2 text-sm flex-1">
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleAuthClick} className="btn-ghost rounded-sm px-5 py-2 text-sm flex-1">
                                    Log In
                                </button>
                                <button onClick={handleJoinClick} className="btn-glow rounded-sm px-5 py-2 text-sm flex-1">
                                    Join Us
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
