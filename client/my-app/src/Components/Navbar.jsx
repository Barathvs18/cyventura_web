import { useEffect, useState } from "react";
import { Home, Info, User, Mail, CalendarCheckIcon, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./nav.css";
import logo from "../assets/logo.png";
import textLogo from "../assets/text.png";

const tabs = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Info, label: "About", id: "about" },
    { icon: CalendarCheckIcon, label: "Events", id: "events" },
    { icon: User, label: "Members", id: "members" },
    { icon: Mail, label: "Contact", id: "contact" }
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

        if (location.pathname !== "/") {
            setActive(-1);
            return;
        }

        const handleScroll = () => {
            const sections = tabs.map(tab => document.getElementById(tab.id));
            let current = 0;
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            sections.forEach((section, index) => {
                if (section) {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        current = index;
                    }
                }
            });
            setActive(current);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const handleTabClick = (id, index) => {
        setIsOpen(false);

        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setActive(index);
    }

    return (
        <nav className="navbar-container">
            <motion.div
                className="logo-wrapper"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                onClick={() => navigate("/")}
            >
                <img src={logo} alt="Logo" className="nav-logo" />
                <img src={textLogo} alt="Cyventura" className="nav-text-logo" />
            </motion.div>

            {/* Desktop Menu */}
            <motion.div
                className="desktop-menu"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`nav-item ${active === index ? "active" : ""}`}
                        onClick={() => handleTabClick(tab.id, index)}
                    >
                        <tab.icon size={18} className="nav-icon" />
                        <span className="nav-label">{tab.label}</span>
                    </div>
                ))}
            </motion.div>

            {/* Mobile Menu Icon */}
            <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mobile-dropdown"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {tabs.map((tab, index) => (
                            <div
                                key={index}
                                className={`mobile-nav-item ${active === index ? "active" : ""}`}
                                onClick={() => handleTabClick(tab.id, index)}
                            >
                                <tab.icon size={20} className="mobile-nav-icon" />
                                <span>{tab.label}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
