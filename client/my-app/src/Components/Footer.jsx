const links = ['Privacy', 'Terms', 'Code of Conduct'];

export default function Footer() {
    return (
        <footer
            className="py-10 px-6 border-t"
            style={{ background: 'var(--black)', borderColor: 'var(--gray-800)' }}
        >
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Brand */}
                <span className="text-white font-extrabold text-base tracking-wider">
                    CY<span style={{ color: 'var(--red)' }}>VENTURA</span>
                </span>

                {/* Copyright */}
                <p className="text-[var(--gray-500)] text-xs">
                    © {new Date().getFullYear()} Cyventura Club. All rights reserved.
                </p>

                {/* Legal links */}
                <div className="flex gap-5 text-xs">
                    {links.map((l) => (
                        <button
                            key={l}
                            className="hover:text-white transition-colors bg-transparent border-none cursor-pointer text-xs"
                            style={{ color: 'var(--gray-500)' }}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>
        </footer>
    );
}
