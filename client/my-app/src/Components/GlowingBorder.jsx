import React from 'react';

function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    let h = hex.replace('#', '');
    if (h.length === 3) {
        h = h
            .split('')
            .map(c => c + c)
            .join('');
    }
    const int = parseInt(h, 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const GlowingBorder = ({
    children,
    color = '#00a8ff',
    borderRadius = 12,
    className,
    style
}) => {
    return (
        <div
            className={`relative overflow-visible isolate ${className ?? ''}`}
            style={{ '--electric-border-color': color, borderRadius, ...style, height: '100%' }}
        >
            <div className="absolute inset-0 rounded-[inherit] pointer-events-none z-0">
                <div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none transition-all duration-300 group-hover:opacity-100 opacity-60"
                    style={{ border: `2px solid ${hexToRgba(color, 0.6)}`, filter: 'blur(1px)' }}
                />
                <div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none transition-all duration-300 group-hover:opacity-100 opacity-40"
                    style={{ border: `2px solid ${color}`, filter: 'blur(4px)' }}
                />
                <div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none -z-[1] scale-[1.05] transition-all duration-500 group-hover:opacity-50 opacity-20"
                    style={{
                        filter: 'blur(20px)',
                        background: `linear-gradient(-30deg, ${color}, transparent, ${color})`
                    }}
                />
            </div>
            <div className="relative rounded-[inherit] z-[1] h-full bg-[var(--gray-800)]">
                {children}
            </div>
        </div>
    );
};

export default GlowingBorder;
