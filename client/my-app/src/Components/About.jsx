import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ─── Animated counter hook ──────────────────────────────────── */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));

        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setCount(start);
          if (start >= target) clearInterval(timer);
        }, 16);
      }
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return [count, ref];
}

/* ─── Premium Feature Card ──────────────────────────────────── */
const FeatureCard = ({ icon, title, desc, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay }}
      whileHover={{ scale: 1.04, y: -8 }}
      whileTap={{ scale: 0.97 }}
      className="relative group p-10 rounded-[44px] bg-[#050A0F] border border-white/5 
                 flex flex-col justify-between overflow-hidden cursor-pointer 
                 min-h-[360px] shadow-2xl"
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 25px 50px -12px rgba(0,0,0,0.6)",
      }}
    >
      {/* Glow Background */}
      <motion.div
        className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full h-48 
                   bg-gradient-to-r from-[#00A8FF] via-[#8A2BE2] to-[#FF1A27] 
                   rounded-full blur-[60px] pointer-events-none z-0 
                   opacity-10 group-hover:opacity-60 transition-opacity duration-500"
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start w-full mb-10">
          <motion.div
            className="w-16 h-16 rounded-[24px] bg-[#0E1520] border border-white/10 
                       flex items-center justify-center text-3xl shadow-inner 
                       group-hover:scale-110 group-hover:rotate-6 
                       transition-transform duration-500"
          >
            {icon}
          </motion.div>

          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 
                          text-[11px] uppercase tracking-widest font-bold 
                          backdrop-blur-md flex items-center gap-2 
                          opacity-50 group-hover:opacity-100 transition-opacity 
                          duration-300 text-white">
            <div className="w-2 h-2 rounded-full bg-[#00A8FF] animate-pulse" />
            Explore
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <h3 className="text-2xl font-bold text-white leading-snug tracking-tight">
            {title}
          </h3>
          <p className="text-[#A0A0A0] text-sm leading-relaxed max-w-[95%]">
            {desc}
          </p>
        </div>
      </div>

      {/* Bottom Progress Line */}
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-[#00A8FF] via-[#8A2BE2] to-[#FF1A27]"
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: delay + 0.3 }}
        />
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────── */

export default function About() {
  const [count1, ref1] = useCounter(150);
  const [count2, ref2] = useCounter(30);
  const [count3, ref3] = useCounter(20);

  const stats = [
    { value: count1, label: "Members", suffix: "+", ref: ref1 },
    { value: count2, label: "Projects", suffix: "+", ref: ref2 },
    { value: count3, label: "Events", suffix: "+", ref: ref3 },
  ];

  const pillars = [
    {
      icon: "⚡",
      title: "Innovation",
      desc: "We encourage bold ideas. Members collaborate on real-world projects that push boundaries and challenge norms.",
    },
    {
      icon: "🔗",
      title: "Community",
      desc: "A tight-knit ecosystem of peers, mentors, and industry contacts that help each other grow every day.",
    },
    {
      icon: "🎯",
      title: "Purpose",
      desc: "Every initiative we undertake is driven by a clear mission — building skills that matter and leaders who inspire.",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden flex flex-col items-center 
                 py-36 md:py-40 px-6 md:px-12 lg:px-20"
      style={{ background: "var(--gray-900)" }}
    >
      {/* Decorative Side Line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--red), transparent)",
        }}
      />

      <div className="max-w-7xl w-full mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-28 text-center max-w-3xl mx-auto space-y-8"
        >
          <p className="uppercase tracking-[0.3em] text-sm text-[var(--gray-300)] font-semibold">
            Who We Are
          </p>

          <h2 className="font-extrabold leading-tight tracking-tight text-4xl md:text-5xl">
            About <span style={{ color: "var(--red)" }}>Cyventura</span>
          </h2>

          <div className="h-1.5 w-24 mx-auto bg-[var(--red)] rounded-full" />

          <p className="text-[var(--gray-300)] leading-relaxed text-lg md:text-xl max-w-2xl mx-auto">
            Cyventura is a student-led tech and innovation club dedicated to
            transforming passionate learners into tech leaders. We build
            projects, host events, and foster a culture of continuous learning
            and collaboration.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 
                     mb-32 max-w-5xl mx-auto text-center"
        >
          {stats.map(({ value, label, suffix, ref }, i) => (
            <motion.div
              key={label}
              ref={ref}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-black/30 px-12 py-12 rounded-[36px] 
                         backdrop-blur-md border border-white/5 
                         shadow-2xl flex flex-col items-center 
                         space-y-4"
            >
              <div
                className="text-6xl font-black"
                style={{
                  color: "var(--red)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value}
                {suffix}
              </div>
              <div className="text-[var(--gray-300)] text-sm tracking-[0.2em] uppercase font-bold">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-14">
          {pillars.map((pillar, i) => (
            <FeatureCard
              key={pillar.title}
              icon={pillar.icon}
              title={pillar.title}
              desc={pillar.desc}
              delay={i * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}