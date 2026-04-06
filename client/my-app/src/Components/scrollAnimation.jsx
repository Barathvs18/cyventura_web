import React, { useState, useEffect, useRef } from 'react';
import './scrollAnimation.css';

export default function ContainerScroll({ titleComponent, children }) {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState(20); // Initial tilted state
  const [scale, setScale] = useState(0.9);      // Initial smaller scale

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the component is in view (0 to 1)
      // When the top of the element hits the bottom of the screen = 0
      // When the element is fully centered = 1
      const progress = Math.min(Math.max((windowHeight - rect.top) / windowHeight, 0), 1);
      
      // Animate from 20deg to 0deg rotation
      const newRotation = 20 - (progress * 20);
      // Animate from 0.9 to 1.0 scale
      const newScale = 0.9 + (progress * 0.1);

      setRotation(newRotation);
      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-container" ref={containerRef}>
      <div className="scroll-header">
        {titleComponent}
      </div>
      <div className="scroll-card-wrapper">
        <div 
          className="scroll-card"
          style={{
            transform: `perspective(1000px) rotateX(${rotation}deg) scale(${scale})`,
          }}
        >
          <div className="scroll-card-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}