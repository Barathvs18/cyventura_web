import { useEffect } from 'react';
import Login from '../Components/Login';

export default function AuthPage() {
    // apply reveal animation logic for login page elements too
    useEffect(() => {
        const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add('visible');
                }),
            { threshold: 0.12 }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main>
            <Login />
        </main>
    );
}
