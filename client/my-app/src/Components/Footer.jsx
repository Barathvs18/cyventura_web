import React from 'react';
import './Footer.css';
import logo from "../assets/logo.png";
import textLogo from "../assets/text.png";
import { Mail, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer-container" id="contact">
            <div className="footer-content">
                {/* Left Side: Logo & Tagline */}
                <div className="footer-left">
                    <div className="footer-brand">
                        <img src={logo} alt="Cyventura Logo" className="footer-logo" />
                        <img src={textLogo} alt="Cyventura" className="footer-text-logo" />
                    </div>
                    <p className="footer-tagline">
                        Organizing Real-World Cybersecurity Experiences. Hands-on CTFs, red team labs & live threat simulations.
                    </p>
                </div>

                {/* Social Links Side */}
                <div className="footer-social">
                    <h4 className="footer-nav-title">Connect With Us</h4>
                    <div className="footer-social-links">
                        <a href="mailto:cyventura.club@gmail.com" className="social-link" title="Email">
                            <Mail size={24} />
                        </a>
                        <a href="https://instagram.com/cyventura_club" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                            <Instagram size={24} />
                        </a>
                        <a href="https://linkedin.com/company/cyventura" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                            <Linkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Cyventura. All rights reserved.</p>
            </div>
        </footer>
    );
}
