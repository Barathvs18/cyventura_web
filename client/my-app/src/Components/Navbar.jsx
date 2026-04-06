import { useEffect, useState } from "react"
import { Home,Info, User, Mail, CalendarCheckIcon } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import "./nav.css"
import logo from "../assets/logo.png"
import textLogo from "../assets/text.png"
const tabs = [
    {
        icon: Home,
        label: "Home",
        id: "home"
    },
    {
        icon: Info,
        label: "About",
        id: "about"
    },
    {
        icon: CalendarCheckIcon,
        label: "Events",
        id: "events"
    },
    {
        icon: User,
        label: "Members",
        id: "members"
    },
    {
        icon: Mail,
        label: "Contact",
        id: "contact"
    }
]

export default function ExpandableTabs() {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState(0)

    // Keep active tab in sync with scroll position
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
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const handleTabClick = (id, index) => {
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
        <div className="navbar-container">
            <motion.div
                className="logo-wrapper"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
            >
                <img src={logo} alt="Logo" className="nav-logo" />
                <img src={textLogo} alt="Cyventura" className="nav-text-logo" />
            </motion.div>

            <motion.div
                className="tabs-wrapper"
                initial={{ y: -150, opacity: 0, x: "-50%" }}
                animate={{ y: 0, opacity: 1, x: "-50%" }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            >

            {tabs.map((tab, index) => {
                const Icon = tab.icon

                return (
                    <div
                        key={index}
                        className={`tab ${active === index ? "active" : ""}`}
                        onClick={() => handleTabClick(tab.id, index)}
                    >
                        <Icon size={18} className="icon" />
                        <span className="label">
                            {tab.label}
                        </span>
                    </div>
                )
            })}

            </motion.div>
        </div>
    )
}
