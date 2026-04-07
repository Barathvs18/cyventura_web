import React, { useEffect } from 'react';
import Events from '../Components/Events';
import Footer from '../Components/Footer';

export default function EventsPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ minHeight: '1500vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, paddingTop: '150px', paddingBottom: '100px' }}>
                <h1 className="title" style={{ textAlign: "center", color: "white", marginBottom: "1rem", fontSize: "3.5rem", fontWeight: "bold" }}>Our Events</h1>
                <p style={{ textAlign: "center", color: "var(--text-gray)", marginBottom: "4rem", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 4rem auto" }}>
                    Discover and participate in our upcoming technical and cultural events designed to foster innovation and learning.
                </p>
                <Events />
            </div>
            <Footer />
        </div>
    );
}
