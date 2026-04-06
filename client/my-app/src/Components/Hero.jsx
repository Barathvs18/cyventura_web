import React, { Suspense } from "react"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Float, ContactShadows } from "@react-three/drei"
import laptopModel from "../assets/cyberpunk_laptop.glb"
import "./hero.css"

function LaptopModel() {
    const { scene } = useGLTF(laptopModel);
    return (
        <primitive object={scene} scale={1.5} position={[0, -0.5, 0]} rotation={[0, -Math.PI / 8, 0]} />
    )
}

export default function Hero() {
    const navigate = useNavigate();
    
    // Motion values for tracking pointer coordinates
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Apply spring physics for smoother rotation
    const springConfig = { damping: 25, stiffness: 150 };
    const spX = useSpring(mouseX, springConfig);
    const spY = useSpring(mouseY, springConfig);

    // Transform points to rotation degrees
    const rotateX = useTransform(spY, [-500, 500], [15, -15]);
    const rotateY = useTransform(spX, [-500, 500], [-15, 15]);

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        mouseX.set(event.clientX - centerX);
        mouseY.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <section className="hero" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            
            <div className="hero-content">
                <motion.div 
                    className="hero-model-container"
                    style={{ rotateY, perspective: 1000 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1.5} />
                        <Environment preset="city" />
                        <Suspense fallback={null}>
                            <LaptopModel />
                        </Suspense>
                        <OrbitControls 
                            enableZoom={false} 
                            enablePan={false}
                            maxPolarAngle={Math.PI / 2.2} 
                            minPolarAngle={Math.PI / 2.2}
                            minAzimuthAngle={-75 * Math.PI / 180}
                            maxAzimuthAngle={75 * Math.PI / 180}
                        />
                        <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                    </Canvas>
                </motion.div>

                <div className="hero-text-container">
                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    >
                        Organizing <span className="text-red">Real&ndash;</span>
                        <span className="text-red">World</span><br/>
                        Cybersecurity<br/>
                        <span className="text-red">Experiences</span>
                    </motion.h1>

                    <motion.p
                        className="hero-subtitle"
                        style={{ marginBottom: '25px' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    > 
                    Hands-on CTFs, red team labs &amp; live threat<br/>simulations.
                    </motion.p>

                    <motion.div 
                        className="hero-stats"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                    >
                        <div className="hero-stat-item">
                            <span className="hero-stat-number">500<span className="text-red">+</span></span>
                            <span className="hero-stat-label">Members</span>
                        </div>
                        <div className="hero-stat-item">
                            <span className="hero-stat-number">32</span>
                            <span className="hero-stat-label">CTFs<br/>Hosted</span>
                        </div>
                        <div className="hero-stat-item">
                            <span className="hero-stat-number">12</span>
                            <span className="hero-stat-label">Partners</span>
                        </div>
                        <div className="hero-stat-item">
                            <span className="hero-stat-number">#1</span>
                            <span className="hero-stat-label">Ranked<br/>Club</span>
                        </div>
                    </motion.div>

                    <motion.button
                        className="hero-btn"
                        onClick={() => navigate('/login')}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Log in
                    </motion.button>
                </div>
            </div>
        </section>
    )
}