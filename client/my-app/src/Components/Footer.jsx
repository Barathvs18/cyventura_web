import React from 'react';
import './Footer.css';
import logo from "../assets/logo.png";
import textLogo from "../assets/text.png";

export default function Footer() {
    return (
        <footer className="footer-container">
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
                
                {/* Right Side: Navigation Details */}
                <div className="footer-right">
                    <h4 className="footer-nav-title">Navigation</h4>
                    <ul className="footer-nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#events">Events</a></li>
                        <li><a href="#members">Members</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Cyventura. All rights reserved.</p>
            </div>
        </footer>
    );
}
