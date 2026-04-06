import React, { useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "./login.css"

export default function LoginHero() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth out the mouse movements
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    // Map the smooth mouse coordinates to 3D rotations
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Calculate mouse position relative to the center of the card
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Get mouse position as a percentage from -0.5 to 0.5
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        // Reset back to original position when cursor leaves
        x.set(0);
        y.set(0);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            navigate('/dashboard');
        } else {
            alert(`Account created successfully for ${formData.name || formData.email}!`);
            setIsLogin(true); // switch back to login mode
        }
    };

    return (
        <div className="login-hero" style={{ perspective: "1000px" }}>

            <motion.div
                className="login-card"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div style={{ transform: "translateZ(50px)" }}>
                    <div className="avatar">S</div>
                </div>

                <div style={{ transform: "translateZ(40px)" }}>
                    <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                </div>

                <div style={{ transform: "translateZ(30px)" }}>
                    <p className="subtitle">
                        {isLogin ? "Sign in to continue to StyleMe" : "Sign up to get started"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ transform: "translateZ(20px)" }}>

                    {/* Animate Name field in and out */}
                    {!isLogin && (
                        <motion.input
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: "auto", marginBottom: "12px" }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="input"
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}

                    <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {isLogin ? (
                        <div className="login-options">
                            <label>
                                <input type="checkbox" />
                                Remember me
                            </label>
                            <span className="forgot">
                                Forgot password?
                            </span>
                        </div>
                    ) : (
                        <div style={{ height: "18px", marginBottom: "18px" }}></div> // Spacing placeholder
                    )}

                    <button type="submit" className="signin">
                        {isLogin ? "Sign In →" : "Sign Up →"}
                    </button>

                </form>

                <div className="divider" style={{ transform: "translateZ(10px)" }}>
                    <span>or</span>
                </div>

                <div style={{ transform: "translateZ(30px)" }}>
                    <button className="google" type="button">
                        G {isLogin ? "Sign in with Google" : "Sign up with Google"}
                    </button>
                </div>

                <div style={{ transform: "translateZ(20px)" }}>
                    <p className="signup">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", textDecoration: "underline" }}>
                            {isLogin ? "Sign up" : "Sign in"}
                        </span>
                    </p>
                </div>

            </motion.div>

        </div>
    )
}