import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './AnimatedTestimonials.css';
import { Instagram, Linkedin, Github } from "lucide-react";

export const AnimatedTestimonials = ({
    testimonials,
    autoplay = false,
    className = "",
}) => {
    const [active, setActive] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleNext = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActive((prev) => (prev + 1) % testimonials.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, testimonials.length]);

    const handlePrev = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, testimonials.length]);

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(handleNext, 5000);
            return () => clearInterval(interval);
        }
    }, [autoplay, handleNext]);

    const getRotation = (index) => {
        const seeds = [12, -7, 15, -12, 8, -18];
        return seeds[index % seeds.length];
    };

    return (
        <div className={`at-wrapper ${className}`}>
            <div className="dossier-header text-center">
                <span className="dossier-eyebrow">O P E R A T O R &nbsp; D O S S I E R</span>
                <h2 className="dossier-main-title">Meet the <span className="text-red">Team</span></h2>
            </div>
            
            <div className="at-grid">
                {/* Image Column */}
                <div className="at-image-container">
                    <div className="at-image-stack">
                        {testimonials.map((testimonial, index) => {
                            const activeState = index === active;
                            const zIndex = activeState ? 999 : testimonials.length + 2 - index;

                            return (
                                <div
                                    key={testimonial.src}
                                    className={`at-image-card ${activeState ? "is-active" : ""}`}
                                    style={{
                                        zIndex: zIndex,
                                        "--init-rotate": `${getRotation(index)}deg`,
                                    }}
                                >
                                    <img
                                        src={testimonial.src}
                                        alt={testimonial.name}
                                        className="at-actual-image"
                                        draggable={false}
                                    />
                                    {/* Accent corners on the active image wrapper */}
                                    {activeState && (
                                        <>
                                            <div className="corner top-left"></div>
                                            <div className="corner bottom-left"></div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Column */}
                <div className="at-content-container">
                    <div className="at-text-content" key={active}>
                        <div className="dossier-status-bar">
                            <div className="status-indicator">
                                <span className="status-dot"></span> ACTIVE
                            </div>
                        </div>

                        <h3 className="at-title">{testimonials[active].name}</h3>
                        <p className="at-subtitle">{testimonials[active].designation}</p>

                        <div className="dossier-divider"></div>

                        {testimonials[active].socials && (
                            <div className="at-socials">
                                {testimonials[active].socials.map((social, idx) => {
                                    const Icon = social.icon;
                                    return (
                                        <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer" className="at-social-icon">
                                            <Icon size={20} />
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        <div className="at-quote-box">
                            {testimonials[active].quote.split(" ").map((word, index) => (
                                <span
                                    key={index}
                                    className="at-word-span"
                                    style={{ animationDelay: `${0.02 * index}s` }}
                                >
                                    {word}&nbsp;
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="at-navigation">
                        <button onClick={handlePrev} className="at-nav-btn dossier-nav-btn">
                            <ArrowLeft className="at-nav-icon left" />
                        </button>
                        <button onClick={handleNext} className="at-nav-btn dossier-nav-btn">
                            <ArrowRight className="at-nav-icon right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Members() {
    const commonSocials = [
        {
            icon: Instagram,
            link: "https://instagram.com"
        },
        {
            icon: Linkedin,
            link: "https://linkedin.com"
        },
        {
            icon: Github,
            link: "https://github.com"
        }
    ];

    const testimonials = [
        {
            quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
            name: "Sarah Chen",
            designation: "Product Manager at TechFlow",
            src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop",
            socials: commonSocials
        },
        {
            quote: "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
            name: "Michael Rodriguez",
            designation: "CTO at Innovate",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
            socials: commonSocials
        },
        {
            quote: "This solution has helped us scale our operations significantly while maintaining high quality standards.",
            name: "Emily Watson",
            designation: "Operations Director at CloudScale",
            src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
            socials: commonSocials
        }
    ];

    return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
}