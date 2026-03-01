import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [hasToken, setHasToken] = useState(false);
    const [user, setUser] = useState(null);

    const menuRef = useRef(null);
    const navRef = useRef(null);
    const indicatorRef = useRef(null);

    const navLinks = [
        { href: "#about", label: "About" },
        { href: "#explore", label: "Explore" },
        { href: "#events", label: "Events" },
        { href: "#contact", label: "Contact" },
    ];

    /* ============================= */
    /* Auth Logic */
    /* ============================= */

    const fetchUser = () => {
        const token = localStorage.getItem("token");
        setHasToken(!!token);

        if (token) {
            fetch("http://localhost:8000/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => data && setUser(data))
                .catch(() => {});
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [location.pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ============================= */
    /* Active Section Highlight */
    /* ============================= */

    useEffect(() => {
        if (location.pathname !== "/") return;

        const sections = ["home", "about", "explore", "events", "contact"];

        const observers = sections.map((id) => {
            const el = document.getElementById(id);
            if (!el) return null;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { threshold: 0.6 }
            );

            obs.observe(el);
            return obs;
        });

        return () => observers.forEach((o) => o?.disconnect());
    }, [location.pathname]);

    /* ============================= */
    /* Animated Underline */
    /* ============================= */

    useEffect(() => {
        if (!navRef.current || !indicatorRef.current) return;

        const activeIndex = navLinks.findIndex(
            (link) =>
                location.pathname === "/" &&
                activeSection === link.href.slice(1)
        );

        const navItems = navRef.current.querySelectorAll(".nav-item");

        if (navItems[activeIndex]) {
            const el = navItems[activeIndex];
            indicatorRef.current.style.width = `${el.offsetWidth}px`;
            indicatorRef.current.style.left = `${el.offsetLeft}px`;
        }
    }, [activeSection, location.pathname]);

    /* ============================= */
    /* Navigation Handlers */
    /* ============================= */

    const handleNavClick = (href) => {
        setMenuOpen(false);

        if (location.pathname !== "/") {
            navigate(`/${href}`);
        } else {
            document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        setMenuOpen(false);

        if (location.pathname !== "/") {
            navigate("/");
        } else {
            document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    /* ============================= */
    /* JSX */
    /* ============================= */

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 transition-all duration-500">
            <div
                className={`w-full flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
                    scrolled
                        ? "bg-black/70 backdrop-blur-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                        : "bg-transparent"
                }`}
            >
                {/* LOGO */}
                <a
                    href="/"
                    onClick={handleHomeClick}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#111] border border-white/10 text-white font-bold text-lg tracking-widest hover:scale-110 transition-transform duration-300"
                >
                    CV
                </a>

                {/* DESKTOP NAV */}
                <nav
                    ref={navRef}
                    className="hidden md:flex relative items-center gap-12"
                >
                    {/* Animated underline */}
                    <span
                        ref={indicatorRef}
                        className="absolute bottom-0 h-[2px] bg-red-600 rounded-full transition-all duration-500 ease-out"
                    />

                    {navLinks.map(({ href, label }) => {
                        const isActive =
                            location.pathname === "/" &&
                            activeSection === href.slice(1);

                        return (
                            <button
                                key={href}
                                onClick={() => handleNavClick(href)}
                                className={`nav-item relative pb-2 text-sm font-semibold tracking-wide transition-all duration-300 ${
                                    isActive
                                        ? "text-white"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </nav>

                {/* CTA / AUTH */}
                <div className="flex items-center gap-4">
                    {hasToken ? (
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-11 h-11 rounded-full bg-[#111] border border-white/10 overflow-hidden hover:scale-105 transition-all duration-300"
                        >
                            {user?.profile_picture ? (
                                <img
                                    src={user.profile_picture}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                            )}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/auth")}
                                className="hidden md:block text-gray-400 hover:text-white transition-colors"
                            >
                                Log In
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/auth", { state: { isRegister: true } })
                                }
                                className="px-6 py-2.5 rounded-full bg-red-600 text-white font-semibold shadow-[0_0_20px_rgba(255,0,0,0.6)] hover:scale-105 transition-all duration-300"
                            >
                                Join Club
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* MOBILE MENU */}
            <div
                ref={menuRef}
                className={`md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[95%] max-w-sm rounded-3xl backdrop-blur-2xl bg-black/90 border border-white/10 shadow-2xl transition-all duration-500 ${
                    menuOpen ? "opacity-100 max-h-[400px]" : "opacity-0 max-h-0"
                } overflow-hidden`}
            >
                <div className="flex flex-col gap-6 px-6 py-8 text-center">
                    {navLinks.map(({ href, label }) => (
                        <button
                            key={href}
                            onClick={() => handleNavClick(href)}
                            className="text-lg font-semibold text-gray-400 hover:text-white transition"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}