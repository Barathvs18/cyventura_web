import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const menuRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Highlight active section
    useEffect(() => {
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
    }, []);

    const navLinks = [
        { href: '#about', label: 'About' },
        { href: '#explore', label: 'Explore' },
        { href: '#events', label: 'Events' },
        { href: '#contact', label: 'Contact' },
    ];

    const scrollTo = (href) => {
        setMenuOpen(false);
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header
            className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4`}
        >
            <div
                className={`w-full max-w-7xl flex items-center justify-between transition-all duration-500 px-6 py-3 rounded-full border border-transparent ${scrolled
                        ? 'bg-black/80 backdrop-blur-xl border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] py-2'
                        : 'bg-transparent'
                    }`}
            >
                {/* Logo - Flex 1 to balance the layout */}
                <div className="flex-1">
                    <a href="#home" onClick={() => scrollTo('#home')} className="flex items-center gap-3 group w-fit">
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
                            onClick={() => scrollTo(href)}
                            className={`nav-link bg-transparent border-none cursor-pointer transition-all duration-300 hover:scale-105 ${activeSection === href.slice(1) ? '!text-white' : 'text-gray-400'
                                }`}
                            style={activeSection === href.slice(1) ? { color: 'var(--white)' } : {}}
                        >
                            {label}
                            {activeSection === href.slice(1) && (
                                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)' }} />
                            )}
                        </button>
                    ))}
                </nav>

                {/* CTA - Flex 1 to balance the layout */}
                <div className="hidden md:flex items-center justify-end gap-4 flex-1">
                    <button
                        onClick={() => scrollTo('#login')}
                        className="text-gray-300 hover:text-white transition-colors text-sm font-medium bg-transparent border-none cursor-pointer"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => scrollTo('#contact')}
                        className="btn-glow rounded-full px-6 py-2 text-xs font-bold tracking-wider"
                    >
                        JOIN CLUB
                    </button>
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
                className="md:hidden overflow-hidden transition-all duration-300"
                style={{
                    maxHeight: menuOpen ? '400px' : '0',
                    opacity: menuOpen ? 1 : 0,
                    background: 'rgba(0,0,0,0.95)',
                    backdropFilter: 'blur(12px)'
                }}
            >
                <div className="px-6 py-6 flex flex-col gap-5 border-t border-[#1a1a1a]">
                    {navLinks.map(({ href, label }) => (
                        <button
                            key={href}
                            onClick={() => scrollTo(href)}
                            className="nav-link text-left text-base bg-transparent border-none cursor-pointer"
                        >
                            {label}
                        </button>
                    ))}
                    <div className="flex gap-3 mt-2">
                        <button onClick={() => scrollTo('#login')} className="btn-ghost rounded-sm px-5 py-2 text-sm flex-1">Log In</button>
                        <button onClick={() => scrollTo('#contact')} className="btn-glow rounded-sm px-5 py-2 text-sm flex-1">Join Us</button>
                    </div>
                </div>
            </div>
        </header>
    );
}
