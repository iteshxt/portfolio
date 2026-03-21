'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/data/portfolio';
import { Github, ExternalLink, Mail, ArrowUpRight, Heart, ArrowDown, MoveRight, Download, X, Moon, Sun, Cloud, Database, BrainCircuit, Network, Code2, Blocks, Truck, Menu, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiPython, SiPytorch, SiMongodb, SiDocker, SiFlask, SiTailwindcss, SiFastapi, SiFirebase, SiGithub, SiLinkedin, SiLeetcode, SiJavascript, SiCplusplus, SiHtml5, SiExpress, SiHuggingface, SiMysql, SiGit, SiTensorflow, SiLinux, SiAmazonwebservices, SiVercel, SiFlutter, SiPhp, SiSelenium, SiAuth0, SiJsonwebtokens } from 'react-icons/si';

/* ════════════════════════════════════════════════
   CROSSHAIR CURSOR
   Full-viewport X/Y lines + solid accent square
   ════════════════════════════════════════════════ */
export function CrosshairCursor() {
  const xRef = useRef<HTMLDivElement>(null);
  const yRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  
  const visible = useRef(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = `${e.clientX}px`;
      const y = `${e.clientY}px`;
      
      if (xRef.current) xRef.current.style.top = y;
      if (yRef.current) yRef.current.style.left = x;
      
      if (dotRef.current) {
        dotRef.current.style.left = x;
        dotRef.current.style.top = y;
      }
      
      if (topRef.current) topRef.current.style.left = x;
      if (bottomRef.current) bottomRef.current.style.left = x;
      if (leftRef.current) leftRef.current.style.top = y;
      if (rightRef.current) rightRef.current.style.top = y;

      if (!visible.current) {
        visible.current = true;
        setShow(true);
      }
    };
    const onLeave = () => { visible.current = false; setShow(false); };
    const onEnter = () => { visible.current = true; setShow(true); };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  const cls = show ? 'visible' : '';
  return (
    <>
      <div ref={xRef} className={`crosshair-x ${cls}`} />
      <div ref={yRef} className={`crosshair-y ${cls}`} />
      <div ref={dotRef} className={`crosshair-dot ${cls}`} />
      <div ref={topRef} className={`crosshair-border-dot top ${cls}`} />
      <div ref={bottomRef} className={`crosshair-border-dot bottom ${cls}`} />
      <div ref={leftRef} className={`crosshair-border-dot left ${cls}`} />
      <div ref={rightRef} className={`crosshair-border-dot right ${cls}`} />
    </>
  );
}

/* ════════════════════════════════════════════════
   ANIMATED SECTION — staggered entrance on scroll
   Each child animates in sequence
   ════════════════════════════════════════════════ */
const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* Wrapper that triggers animation on scroll */
function AnimatedSection({ children, id, className = '' }: { children: React.ReactNode; id: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`relative overflow-x-clip ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ════════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════════ */
function Nav() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: '1.About', href: '#about' },
    { label: '2.Experience', href: '#experience' },
    { label: '3.Education', href: '#education' },
    { label: '4.Certificates', href: '#certificates' },
    { label: '5.Projects', href: '#projects' },
    { label: '6.Contact', href: '#contact' },
  ];

  // Track the active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'education', 'certificates', 'projects', 'contact'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Trigger when section top enters the upper third of the viewport
          if (rect.top <= window.innerHeight / 3) {
            current = `#${section}`;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when modals/menus are open
  useEffect(() => {
    if (resumeOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('resume-open');
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('resume-open');
    }
    return () => { 
      document.body.style.overflow = 'auto';
      document.body.classList.remove('resume-open');
    };
  }, [resumeOpen, mobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-12 py-4" style={{ backgroundColor: 'color-mix(in srgb, var(--background) 85%, transparent)', backdropFilter: 'blur(16px)' }}>
        <Link href="/" onClick={(e) => { 
          if (window.location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }} className="relative flex items-center group overflow-visible" style={{ color: 'var(--foreground)' }}>
          <div className="w-10 h-10 relative transition-transform duration-500 group-hover:scale-110 active:scale-95">
            <Image 
              src="/icon.svg" 
              alt="Portfolio Icon" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Links (Centered) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 lg:gap-12 w-max whitespace-nowrap">
          {links.map((l) => {
            const isActive = activeSection === l.href;
            return (
              <a 
                key={l.href} 
                href={l.href} 
                className={`group hover-underline ${isActive ? 'active' : ''} font-mono text-[13px] md:text-sm font-semibold tracking-widest uppercase transition-colors hover:text-[var(--accent)] flex items-center gap-1.5`} 
                style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }}
              >
                {l.label} <ArrowUpRight className="inline w-3.5 h-3.5 transition-all text-[var(--accent)] opacity-100 translate-x-0" />
              </a>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <button onClick={() => setResumeOpen(true)} className="!hidden md:!flex btn-primary text-xs py-2.5 px-5 items-center gap-2 relative z-10 transition-transform active:scale-95">
          VIEW RESUME <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden flex items-center justify-center w-10 h-10 border transition-all active:scale-90"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[55] bg-[var(--background)] flex flex-col pt-32 pb-12 px-8 overflow-y-auto"
          >
            {/* Nav Links List */}
            <div className="flex flex-col gap-8 mb-16">
              {links.map((l, i) => {
                const isActive = activeSection === l.href;
                return (
                  <motion.a
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex flex-col gap-1 items-start"
                  >
                    <span className={`font-mono text-[10px] tracking-widest uppercase opacity-40 ${isActive ? 'text-[var(--accent)]' : ''}`}>Section 0{i + 1}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-4xl font-bold tracking-tight uppercase transition-all group-hover:pl-4 group-hover:text-[var(--accent)] ${isActive ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>
                        {l.label.includes('.') ? l.label.split('.')[1] : l.label}
                      </span>
                      {isActive && <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto"
            >
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setResumeOpen(true);
                }} 
                className="w-full btn-primary py-5 text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
              >
                VIEW RESUME <ArrowUpRight className="w-5 h-5" />
              </button>
              <p className="font-mono text-[10px] uppercase tracking-widest text-center mt-6 opacity-40">Itesh Tomar Portfolio © 2026</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Internal Theme Premium Resume Modal */}
      <AnimatePresence>
        {resumeOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8" 
            style={{ backgroundColor: 'rgba(10,10,10,0.4)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl h-full flex flex-col bg-[var(--background)] overflow-hidden shadow-2xl relative" 
              style={{ border: '1px solid var(--border)' }}
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-[var(--background)] z-10" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 bg-[var(--accent)]" />
                   <p className="font-mono font-bold tracking-widest text-sm uppercase m-0 leading-none" style={{ color: 'var(--foreground)' }}>RESUME</p>
                </div>
                <div className="flex items-center gap-3">
                  <a href="/resume.pdf" download="Itesh-Tomar-CV.pdf" className="px-4 py-2 border hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex items-center gap-2 group" style={{ borderColor: 'var(--border)' }}>
                    <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="font-mono text-xs font-bold tracking-widest uppercase">Download</span>
                  </a>
                  <button onClick={() => setResumeOpen(false)} className="px-4 py-2 border hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors flex items-center gap-2 group" style={{ borderColor: 'var(--border)' }}>
                    <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
                    <span className="font-mono text-xs font-bold tracking-widest uppercase">Close</span>
                  </button>
                </div>
              </div>

              {/* Modal Body: Custom Iframe Context */}
              <div className="flex-1 w-full bg-[var(--background)] relative overflow-hidden flex items-center justify-center">
                  {/* Desktop Preview */}
                  <iframe 
                    src="/resume.pdf#toolbar=0&view=FitH" 
                    className="w-full h-full border-none absolute inset-0 z-0 bg-white hidden md:block"
                    style={{ mixBlendMode: 'normal' }}
                    title="Itesh Tomar Resume Document"
                  />

                  {/* Mobile Preview Fallback (Centered Button) */}
                  <div className="md:hidden flex flex-col items-center justify-center p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-20 h-20 mb-8 border border-dashed flex items-center justify-center relative group" style={{ borderColor: 'var(--accent)' }}>
                      <Download className="w-8 h-8 opacity-20 transition-all group-hover:opacity-40" />
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-5 transition-opacity group-hover:opacity-10" />
                    </div>
                    
                    <h3 className="font-mono text-lg font-bold uppercase tracking-widest mb-4">Mobile Preview</h3>
                    <p className="font-mono text-xs opacity-60 mb-10 max-w-[240px] leading-relaxed mx-auto">
                      Device browsers typically block integrated PDF previews...
                    </p>

                    <a 
                      href="/resume.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary w-full py-5 px-10 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                      OPEN IN BROWSER <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Elegant Fallback Loader inside iframe container (Desktop only) */}
                  <div className="absolute inset-0 flex-col items-center justify-center -z-10 opacity-50 hidden md:flex">
                    <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                    <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Loading Document...</span>
                  </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════
   TECH MARQUEE
   ════════════════════════════════════════════════ */
function TechMarquee() {
  const techs = [
    { name: 'REACT', icon: SiReact, color: '#61DAFB' },
    { name: 'NEXT.JS', icon: SiNextdotjs, color: 'var(--foreground)' },
    { name: 'NODE.JS', icon: SiNodedotjs, color: '#339933' },
    { name: 'TYPESCRIPT', icon: SiTypescript, color: '#3178C6' },
    { name: 'PYTHON', icon: SiPython, color: '#3776AB' },
    { name: 'PYTORCH', icon: SiPytorch, color: '#EE4C2C' },
    { name: 'MONGODB', icon: SiMongodb, color: '#47A248' },
    { name: 'DOCKER', icon: SiDocker, color: '#2496ED' },
    { name: 'FLASK', icon: SiFlask, color: 'var(--foreground)' },
    { name: 'TAILWIND', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'FASTAPI', icon: SiFastapi, color: '#009688' },
    { name: 'FIREBASE', icon: SiFirebase, color: '#FFCA28' }
  ];
  const doubled = [...techs, ...techs, ...techs];

  return (
    <div className="overflow-hidden py-5 border-y" style={{ borderColor: 'var(--border)' }}>
      <div className="marquee-track">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-2.5 font-mono text-sm font-bold tracking-[0.15em] whitespace-nowrap uppercase" style={{ color: t.color }}>
            <t.icon className="w-5 h-5" />
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   HERO SECTION
   Big impactful typography with parallax
   ════════════════════════════════════════════════ */
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -80]);

  return (
    <motion.section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-10 md:pt-0 pb-20 md:pb-8"
      style={{ opacity: heroOpacity, y: heroY }}
    >
      {/* Center: Impact hero */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-[90rem] mx-auto gap-12 lg:gap-20">
        <div className="flex flex-col justify-center w-full">
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl mb-2"
            style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300, fontFamily: 'Georgia, serif' }}
          >
            Hello – I&apos;m
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="display-hero mb-4"
          >
            Itesh Tomar
          </motion.h1>

          {/* Catchy tagline — large, impactful */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="display-medium max-w-2xl mb-8"
            style={{ color: 'var(--muted)' }}
          >
            Crafting <span className="text-accent-italic">digital</span> experiences
            <br />
            with code & creativity
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mb-10 lg:mb-0"
          >
            <div className="inline-block font-mono text-xs md:text-sm font-bold tracking-[0.2em] uppercase py-2.5 px-5 border" style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>
              Software Developer
            </div>
            {/* Keyboard Hint - Desktop only */}
            <div className="hidden md:block mt-10 font-mono text-[10px] tracking-[0.2em] uppercase opacity-60" style={{ color: 'var(--muted)' }}>
              Press 1-6 to navigate using Keyboard
            </div>
          </motion.div>
        </div>

        {/* Profile Image & Socials */}
        <motion.div
          initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 md:gap-10 shrink-0 mx-auto md:mx-0 mt-12 md:mt-12 md:-translate-x-4 lg:-translate-x-12 md:translate-y-6 lg:translate-y-10"
        >
          {/* Profile Image */}
          <div className="relative w-[240px] h-[290px] md:w-[320px] md:h-[400px] lg:w-[420px] lg:h-[500px] group">
          {/* Open to Work Badge - In-bounds bottom right */}
          <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 z-30 flex items-center gap-2.5 px-4 py-2.5 border shadow-2xl bg-[var(--background)] transition-transform duration-500 hover:-translate-y-1 hover:-translate-x-1" style={{ borderColor: 'var(--border)' }}>
            <div className="w-2.5 h-2.5 bg-green-500" />
            <p className="font-mono text-[10px] md:text-xs font-bold tracking-widest uppercase m-0 leading-none" style={{ color: 'var(--foreground)' }}>Open to work</p>
          </div>

          {/* Decorative Offset Frame - CONTRAINED */}
          <div className="absolute bottom-[-8px] right-[-8px] lg:bottom-[-10px] lg:right-[-10px] w-full h-full border border-dashed rounded-xl z-0 transition-transform duration-500 group-hover:-translate-x-[4px] group-hover:-translate-y-[4px]" style={{ borderColor: 'var(--accent)' }} />
          
          {/* Accent glow behind image */}
          <div className="absolute inset-4 rounded-2xl opacity-10 blur-3xl transition-opacity duration-700 group-hover:opacity-30" style={{ backgroundColor: 'var(--accent)' }} />
          
          {/* Main Image Container */}
          <div className="relative w-full h-full z-10 rounded-xl overflow-hidden bg-[var(--background)] p-2 shadow-sm transition-shadow duration-500 group-hover:shadow-xl" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src="/profile_styled.png"
                alt="Itesh Tomar"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                priority
              />
            </div>
          </div>

          {/* Cyberpunk/Tech Corner Accents */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 z-20 transition-all duration-300 group-hover:-top-2 group-hover:-left-2" style={{ borderColor: 'var(--accent)' }} />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 z-20 transition-all duration-300 group-hover:-bottom-2 group-hover:-right-2" style={{ borderColor: 'var(--accent)' }} />
          </div>

          {/* Social Links Row */}
          <div className="flex items-center justify-center gap-4 lg:gap-6 mt-2">
            <a href="mailto:iteshxt@gmail.com" className="group flex flex-col items-center gap-2 hover-underline transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--foreground)' }}>
              <span className="w-10 h-10 md:w-14 md:h-14 border flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <Mail className="w-4 h-4 md:w-6 md:h-6" />
              </span>
            </a>
            
            <a href="https://github.com/iteshxt" target="_blank" className="group flex flex-col items-center gap-2 hover-underline transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--foreground)' }}>
              <span className="w-10 h-10 md:w-14 md:h-14 border flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <SiGithub className="w-4 h-4 md:w-6 md:h-6" />
              </span>
            </a>
            
            <a href="https://linkedin.com/in/iteshxt" target="_blank" className="group flex flex-col items-center gap-2 hover-underline transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--foreground)' }}>
              <span className="w-10 h-10 md:w-14 md:h-14 border flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <SiLinkedin className="w-4 h-4 md:w-6 md:h-6" />
              </span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom: Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-16 md:bottom-8 left-0 right-0 flex items-center justify-center gap-2 pointer-events-none"
      >
        <ArrowDown className="w-4 h-4 animate-bounce" style={{ color: 'var(--muted)' }} />
        <span className="text-caption">Scroll to explore</span>
      </motion.div>
    </motion.section>
  );
}

/* ════════════════════════════════════════════════
   ABOUT SECTION
   ════════════════════════════════════════════════ */
const skillIcons: Record<string, { icon: any, color: string }> = {
  'Python': { icon: SiPython, color: '#3776AB' },
  'JavaScript': { icon: SiJavascript, color: '#F7DF1E' },
  'TypeScript': { icon: SiTypescript, color: '#3178C6' },
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  'React.js': { icon: SiReact, color: '#61DAFB' },
  'Java': { icon: Code2, color: '#007396' },
  'C++': { icon: SiCplusplus, color: '#00599C' },
  'MERN Stack': { icon: Blocks, color: '#47A248' },
  'Next.js': { icon: SiNextdotjs, color: 'var(--foreground)' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
  'PyTorch': { icon: SiPytorch, color: '#EE4C2C' },
  'TensorFlow': { icon: SiTensorflow, color: '#FF6F00' },
  'GitHub': { icon: SiGithub, color: 'var(--foreground)' },
  'Docker': { icon: SiDocker, color: '#2496ED' },
  'Vercel': { icon: SiVercel, color: 'var(--foreground)' },
  'AWS': { icon: SiAmazonwebservices, color: '#232F3E' },
  'Linux': { icon: SiLinux, color: '#FCC624' },
  'Firebase': { icon: SiFirebase, color: '#FFCA28' },
  'MongoDB': { icon: SiMongodb, color: '#4d9941' },
  'Flutter': { icon: SiFlutter, color: '#02569B' },
  'PHP': { icon: SiPhp, color: '#777BB4' },
  'MySQL': { icon: SiMysql, color: '#4479A1' },
  'Huggingface': { icon: SiHuggingface, color: '#FFD21E' },
  'Gemini': { icon: BrainCircuit, color: '#4285F4' },
  'JWT': { icon: SiJsonwebtokens, color: '#d63384' },
  'Auth': { icon: SiAuth0, color: '#EB5424' },
  'REST API': { icon: Network, color: '#009688' },
  'Microservices': { icon: Blocks, color: '#7c5cfc' },
  'Selenium': { icon: SiSelenium, color: '#43B02A' },
  'WebGPU': { icon: SiJavascript, color: '#F7DF1E' }, 
  'WebAssembly': { icon: Blocks, color: '#654FF0' },
  'Razorpay': { icon: Network, color: '#3395FF' },
  'Ekart': { icon: Truck, color: '#00D09C' },
};

function getSkillIcon(skill: string) {
  const normalizedSkill = skill.toLowerCase();
  
  // Exact matches first
  if (skillIcons[skill]) return skillIcons[skill];
  
  // Partial matches with high priority
  if (normalizedSkill.includes('next.js')) return skillIcons['Next.js'];
  if (normalizedSkill.includes('node')) return skillIcons['Node.js'];
  if (normalizedSkill.includes('gemini') || normalizedSkill.includes('ai')) return skillIcons['Gemini'];
  if (normalizedSkill.includes('api')) return skillIcons['REST API'];
  if (normalizedSkill.includes('jwt') || normalizedSkill.includes('auth')) return skillIcons['JWT'];
  if (normalizedSkill.includes('python')) return skillIcons['Python'];
  if (normalizedSkill.includes('react')) return skillIcons['React.js'];
  if (normalizedSkill.includes('mongo')) return skillIcons['MongoDB'];
  if (normalizedSkill.includes('microservices')) return skillIcons['Microservices'];
  if (normalizedSkill.includes('flutter')) return skillIcons['Flutter'];
  
  // Fallback patterns
  if (normalizedSkill.includes('aws') || normalizedSkill.includes('vercel') || normalizedSkill.includes('railway')) return { icon: Cloud, color: '#FF9900' };
  if (normalizedSkill.includes('sql') || normalizedSkill.includes('database') || normalizedSkill.includes('rag')) return { icon: Database, color: '#4479A1' };
  if (normalizedSkill.includes('nlp') || normalizedSkill.includes('fine-tuning') || normalizedSkill.includes('model')) return { icon: BrainCircuit, color: '#FFD21E' };
  if (normalizedSkill.includes('java')) return { icon: Code2, color: '#007396' };
  if (normalizedSkill.includes('mern')) return { icon: Blocks, color: '#47A248' };
  
  return { icon: Code2, color: 'var(--muted)' };
}

function AboutSection() {
  return (
    <AnimatedSection id="about" className="py-28 md:py-36 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <motion.div variants={itemUp} className="flex items-center gap-4 mb-8">
          <p className="section-label">[ABOUT]</p>
          <div className="flex-1 section-divider" />
        </motion.div>

        {/* Big display heading + description */}
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-12 md:gap-20 mb-20">
          <motion.div variants={itemLeft}>
            <h2 className="display-huge mb-4">
              Solving <span className="text-accent-italic">code</span>
              <br />
              Problems
            </h2>
          </motion.div>
          <motion.div variants={itemRight} className="flex flex-col justify-end gap-4">
            <p className="text-body-lg">
              Software Developer crafting interactive web experiences. I specialize in turning complex ideas into pixel-perfect, performant applications.
            </p>
            <p className="text-body">
              Currently exploring AI-powered tools and building products that blend creativity with code. I work across the full stack — React, Next.js, Node.js, Python — with hands-on experience fine-tuning language models.
            </p>
          </motion.div>
        </div>

        {/* Skills grid — each category animates in */}
        <motion.div variants={itemUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {Object.entries(portfolioData.skills).filter(([key]) => key !== 'soft').map(([category, skills]) => (
            <div key={category}>
              <p className="font-mono text-sm tracking-widest uppercase mb-5 font-bold" style={{ color: 'var(--accent)' }}>{category}</p>
              <div className="flex flex-col gap-3">
                {(skills as string[]).map((skill) => {
                  const tech = getSkillIcon(skill);
                  const Icon = tech.icon;
                  return (
                    <div key={skill} className="flex items-center gap-3.5 px-4 py-3 border transition-all hover:bg-[var(--accent-bg)] hover:border-[var(--accent)] group" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110 drop-shadow-sm" style={{ color: tech.color }} />
                      <span className="font-mono text-[13px] md:text-sm font-bold tracking-wide" style={{ color: 'var(--foreground)' }}>
                        {skill}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ════════════════════════════════════════════════
   EXPERIENCE SECTION
   Each job animates in one after another
   ════════════════════════════════════════════════ */
function ExperienceSection() {
  return (
    <AnimatedSection id="experience" className="py-28 md:py-36 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <motion.div variants={itemUp} className="flex items-center gap-4 mb-4">
          <p className="section-label">[EXPERIENCE]</p>
          <div className="flex-1 section-divider" />
        </motion.div>

        {/* Experience Header */}
        <motion.h2 variants={itemUp} className="display-large mb-16">
          Professional <span className="text-accent-italic">journey</span>
        </motion.h2>

        <div className="space-y-40">
          {portfolioData.experience.map((job) => (
            <motion.div
              key={job.id}
              variants={itemUp}
              className="group relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20">
                {/* Left: Branding & Role */}
                <div>
                  <div className="mb-6">
                    {/* Badge Style Company Tag */}
                    <div className="inline-block font-mono text-xs font-bold tracking-[0.2em] uppercase py-2 px-4 border mb-6" style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'rgba(124, 92, 252, 0.05)' }}>
                      {job.company}
                    </div>
                    <h3 className="display-medium balance mb-4">
                      {job.title}
                    </h3>
                    <div className="font-mono text-[10px] md:text-xs tracking-widest uppercase opacity-60 flex items-center gap-3 mb-8">
                      <span>{job.duration}</span>
                      <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: 'var(--muted)' }} />
                      <span>{job.location}</span>
                    </div>

                    {/* Tech Stack Horizontal Lineup */}
                    <div className="flex flex-wrap gap-x-5 gap-y-3 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                      {job.technologies.map((t) => {
                        const tech = getSkillIcon(t);
                        const Icon = tech.icon;
                        return (
                          <div key={t} className="flex items-center gap-2.5 transition-all group/tech">
                            <Icon className="w-5 h-5 transition-transform group-hover/tech:scale-110" style={{ color: tech.color }} />
                            <span className="font-mono text-[11px] md:text-sm font-bold tracking-wide opacity-80 group-hover/tech:opacity-100" style={{ color: 'var(--foreground)' }}>
                              {t}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Narrative Description */}
                <div className="flex flex-col">
                  <p className="text-body-lg text-balance leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ════════════════════════════════════════════════
   EDUCATION SECTION
   ════════════════════════════════════════════════ */
function EducationSection() {
  return (
    <AnimatedSection id="education" className="py-28 md:py-36 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemUp} className="flex items-center gap-4 mb-4">
          <p className="section-label">[EDUCATION]</p>
          <div className="flex-1 section-divider" />
        </motion.div>

        <motion.h2 variants={itemUp} className="display-large mb-16">
          Academic <span className="text-accent-italic">background</span>
        </motion.h2>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
            {portfolioData.education.map((edu, index) => {
              const isLast = index === portfolioData.education.length - 1;
              return (
                <motion.div key={edu.id} variants={itemUp} className="relative group flex flex-col h-full">
                  
                  {/* DESKTOP TIMELINE LINE (Centers precisely) */}
                  {!isLast && (
                    <div className="hidden md:block absolute top-[11px] left-1/2 w-[calc(100%+2.5rem)] h-[3px] z-0 pointer-events-none transition-all duration-300 group-hover:bg-[var(--foreground)]" style={{ backgroundColor: 'var(--accent)' }} />
                  )}

                  {/* DESKTOP TIMELINE SQUARE (Centered correctly above content) */}
                  <div className="hidden md:block absolute top-[12.5px] left-1/2 w-3.5 h-3.5 z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:scale-125 group-hover:rotate-[45deg] group-hover:bg-[var(--foreground)] outline outline-2 outline-transparent group-hover:outline-[var(--accent)]" style={{ backgroundColor: 'var(--accent)' }} />
                  
                  {/* MOBILE TIMELINE LINE */}
                  {!isLast && (
                    <div className="md:hidden absolute -left-[1px] top-[19px] h-[calc(100%+4rem)] w-[3px] z-0 pointer-events-none transition-all duration-300 group-hover:bg-[var(--foreground)]" style={{ backgroundColor: 'var(--accent)' }} />
                  )}

                  {/* MOBILE TIMELINE SQUARE */}
                  <div className="md:hidden absolute top-[12px] -left-[7.5px] w-3.5 h-3.5 z-10 transition-all duration-300 group-hover:scale-125 group-hover:rotate-[45deg] group-hover:bg-[var(--foreground)] outline outline-2 outline-transparent group-hover:outline-[var(--accent)]" style={{ backgroundColor: 'var(--accent)' }} />

                  {/* CONTENT (Centered on md) */}
                  <div className="md:pt-10 md:items-center md:text-center pl-8 md:pl-0 flex flex-col flex-1">
                    <div className="text-sm font-mono mb-3 font-semibold tracking-wider transition-colors duration-300" style={{ color: 'var(--accent)' }}>
                      {edu.duration}
                    </div>
                    
                    <h3 className="mb-3 text-2xl font-bold leading-tight" style={{ color: 'var(--foreground)' }}>
                      {edu.degree}
                    </h3>
                    
                    <p className="text-base font-medium mb-8" style={{ color: 'var(--foreground)' }}>
                      {edu.institution}
                      <span className="block mt-1 font-normal" style={{ color: 'var(--muted)' }}>{edu.location}</span>
                    </p>
                    
                    <div className="mt-auto flex items-start">
                      <div className="inline-block px-4 py-2 text-sm font-mono font-bold transition-all duration-300" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}>
                        {edu.score}
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ════════════════════════════════════════════════
   CERTIFICATES SECTION
   ════════════════════════════════════════════════ */
function CertificatesSection() {
  return (
    <AnimatedSection id="certificates" className="py-28 md:py-36 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemUp} className="flex items-center gap-4 mb-4">
          <p className="section-label">[CERTIFICATES]</p>
          <div className="flex-1 section-divider" />
        </motion.div>

        <motion.h2 variants={itemUp} className="display-large mb-16">
          Verified <span className="text-accent-italic">credentials</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {portfolioData.certificates.map((cert) => (
            <motion.div
              key={cert.id}
              variants={itemScale}
              className="group relative flex flex-col p-6 md:p-8 border transition-all duration-500 hover:border-[var(--accent)]"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
            >
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r transition-all duration-300 group-hover:w-full group-hover:h-full opacity-0 group-hover:opacity-10 pointer-events-none" style={{ borderColor: 'var(--accent)' }} />

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-50">{cert.date}</span>
                  <Award className="w-6 h-6 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold leading-tight balance mb-3 group-hover:text-[var(--accent)] transition-colors">
                  {cert.title}
                </h3>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <div className="inline-block self-start font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase py-2 px-4 border" style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'rgba(124, 92, 252, 0.05)' }}>
                  {cert.issuer}
                </div>
                
                <Link 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-sm font-mono font-black tracking-tighter uppercase group/link"
                >
                  <span className="relative overflow-hidden">
                    VERIFY CREDENTIAL
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--foreground)] translate-x-[-100%] transition-transform group-hover/link:translate-x-0" />
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ════════════════════════════════════════════════
   PROJECTS SECTION
   Cards with scale-in + hover lift
   ════════════════════════════════════════════════ */
function ProjectsSection() {
  return (
    <AnimatedSection id="projects" className="py-28 md:py-36 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemUp} className="flex items-center gap-4 mb-4">
          <p className="section-label">[PROJECTS]</p>
          <div className="flex-1 section-divider" />
        </motion.div>

        <motion.h2 variants={itemUp} className="display-large mb-32">
          Selected <span className="text-accent-italic">works</span>
        </motion.h2>

        {/* Featured Projects with alternating layout */}
        <div className="flex flex-col gap-40 md:gap-64 mb-40">
          {portfolioData.projects.featured.map((project, index) => {
            const isEven = index % 2 === 0;
            const projectAccent = project.accentColor || 'var(--accent)';
            const accentBg = project.accentColor ? `${project.accentColor}15` : 'var(--accent-bg)';
            const accentLength = project.titleAccentLength || 3;

            return (
              <motion.div 
                key={project.id}
                variants={itemUp}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}
                style={{ 
                  '--accent': projectAccent,
                  '--accent-bg': accentBg
                } as React.CSSProperties}
              >
                {/* Image Side with Hero-style Frame */}
                <div className="w-full md:w-1/2 relative group">
                  {/* Floating Tech Number */}
                  <span className={`absolute -top-12 md:-top-20 ${isEven ? '-left-6 md:-left-16' : '-right-6 md:-right-16'} font-mono font-black text-8xl md:text-[12rem] opacity-[0.03] select-none pointer-events-none transition-opacity group-hover:opacity-[0.08]`}>
                    0{index + 1}
                  </span>

                  <div className="relative aspect-[16/10] z-10">
                    {/* Decorative Offset Frame - CONTRAINED */}
                    <div className="absolute top-[-12px] left-[-12px] lg:top-[-16px] lg:left-[-16px] w-full h-full border border-dashed z-0 transition-transform duration-500 group-hover:translate-x-[4px] group-hover:translate-y-[4px]" style={{ borderColor: 'var(--accent)' }} />
                    
                    {/* Main Image Container */}
                    <div className="relative w-full h-full z-10 bg-[var(--background)] p-2 shadow-2xl transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]" style={{ border: '1px solid var(--border)' }}>
                      <div className="relative w-full h-full overflow-hidden">
                        <Image 
                          src={project.image} 
                          alt={project.title} 
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-opacity duration-700"
                          priority={index === 0}
                        />
                        {/* Static Overlay Glow (No hover change) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent opacity-30" />
                      </div>
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 z-20 transition-all duration-300 group-hover:-top-3 group-hover:-left-3" style={{ borderColor: 'var(--accent)' }} />
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 z-20 transition-all duration-300 group-hover:-bottom-3 group-hover:-right-3" style={{ borderColor: 'var(--accent)' }} />
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <div className="flex flex-col gap-2 mb-8">
                    <div className="font-mono text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">
                      Featured Project
                    </div>
                    <h3 className="display-medium tracking-tight">
                      {project.title.split('').map((char, i) => (
                        <span key={i} className={i >= project.title.length - accentLength ? 'text-accent-italic' : ''}>
                          {char}
                        </span>
                      ))}
                    </h3>
                    <p className="font-mono text-xs font-bold tracking-widest uppercase mt-1" style={{ color: 'var(--accent)' }}>
                      {project.subtitle}
                    </p>
                  </div>

                  <p className="text-body-lg text-balance leading-relaxed mb-10 opacity-80">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-x-6 gap-y-4 mb-12 border-l-2 pl-6" style={{ borderColor: 'var(--accent)' }}>
                    {project.technologies.slice(0, 5).map((techName) => {
                      const tech = getSkillIcon(techName);
                      const Icon = tech.icon;
                      return (
                        <div key={techName} className="flex items-center gap-2.5 group/tech">
                          <Icon className="w-5 h-5 transition-transform group-hover/tech:scale-110" style={{ color: tech.color }} />
                          <span className="font-mono text-xs font-bold tracking-tight uppercase opacity-60 group-hover/tech:opacity-100">
                            {techName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-10">
                    <Link 
                      href={project.github} 
                      target="_blank" 
                      className="group/link flex items-center gap-2.5 text-xs font-mono font-black tracking-widest uppercase"
                    >
                      <Github className="w-4 h-4 transition-transform group-hover/link:rotate-12" />
                      <span className="relative overflow-hidden">
                        SOURCE CODE
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--foreground)] translate-x-[-101%] transition-transform group-hover/link:translate-x-0" />
                      </span>
                    </Link>
                    <Link 
                      href={project.live} 
                      target="_blank" 
                      className="group/link flex items-center gap-2.5 text-xs font-mono font-black tracking-widest uppercase text-[var(--accent)]"
                    >
                      <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                      <span className="relative overflow-hidden">
                        LIVE DEMO
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--accent)] translate-x-[-101%] transition-transform group-hover/link:translate-x-0" />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Other Projects Horizontally Scrollable Grid */}
        {portfolioData.projects.other && portfolioData.projects.other.length > 0 && (
          <div className="relative group/other">
            <motion.div variants={itemUp} className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4 flex-1">
                <p className="section-label opacity-40">[SECONDARY WORKS]</p>
                <div className="flex-1 border-t border-dashed" style={{ borderColor: 'var(--border)' }} />
              </div>
              
              {/* Scroll Hints / Controls */}
              <div className="flex items-center gap-6 ml-6">
                <span className="hidden md:block font-mono text-[9px] font-bold tracking-[0.3em] uppercase opacity-30 group-hover/other:opacity-60 transition-opacity">
                  Scroll to explore
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const el = document.getElementById('secondary-scroll');
                      if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
                    }}
                    className="w-10 h-10 border border-[var(--border)] flex items-center justify-center hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300 group/btn"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('secondary-scroll');
                      if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
                    }}
                    className="w-10 h-10 border border-[var(--border)] flex items-center justify-center hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300 group/btn"
                  >
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>

            <div 
              id="secondary-scroll"
              className="grid grid-flow-col auto-cols-[85%] md:auto-cols-[calc(33.33%-16px)] overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            >
              {portfolioData.projects.other.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemScale}
                  className="group/card relative snap-start p-8 border hover:border-[var(--accent)] transition-all duration-300 flex flex-col items-start h-full"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-4 w-full mb-6">
                    <div className="w-10 h-10 border flex items-center justify-center shrink-0" style={{ borderColor: 'var(--border)' }}>
                      <Image 
                        src={`/projects/${project.image}`} 
                        alt={project.title} 
                        width={24} 
                        height={24} 
                        className="object-contain"
                      />
                    </div>
                    <h4 className="text-xl font-bold group-hover/card:text-[var(--accent)] transition-colors line-clamp-1">{project.title}</h4>
                  </div>
                  <p className="text-sm opacity-60 line-clamp-3 leading-relaxed mb-8 flex-1">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-3 mb-8 mt-auto border-l-2 pl-4" style={{ borderColor: 'var(--border)' }}>
                    {project.technologies.slice(0, 3).map((techName) => {
                      const tech = getSkillIcon(techName);
                      const Icon = tech.icon;
                      return (
                        <div key={techName} className="flex items-center gap-2 group/tech">
                          <Icon className="w-4 h-4 transition-transform group-hover/tech:scale-110 opacity-60" style={{ color: tech.color }} />
                          <span className="font-mono text-[9px] font-bold tracking-tight uppercase opacity-40 group-hover/tech:opacity-80">
                            {techName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-6">
                    <Link 
                      href={project.github} 
                      target="_blank" 
                      className="text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-2 hover:text-[var(--accent)] transition-colors group/github"
                    >
                      <Github className="w-3.5 h-3.5 transition-transform group-hover/github:scale-110" />
                      <span className="relative">
                        GITHUB
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover/github:w-full" />
                      </span>
                    </Link>
                    {project.live && (
                      <Link 
                        href={project.live} 
                        target="_blank" 
                        className="text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-2 hover:text-[var(--accent)] transition-colors group/link"
                      >
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:scale-110" />
                        <span className="relative">
                          VISIT
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover/link:w-full" />
                        </span>
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Blueprint Track Line Hint */}
            <div className="w-full h-[1px] bg-[var(--border)] opacity-20 relative mt-4 overflow-hidden">
               <div className="absolute top-0 left-0 w-1/4 h-full bg-[var(--accent)] opacity-40 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

/* ════════════════════════════════════════════════
   CONTACT SECTION
   ════════════════════════════════════════════════ */
function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    emailjs.init('_wY5aajq4Kb3QguKO');
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.send('service_i977fd6', 'template_7astiue', {
        name: formData.name, email: formData.email,
        time: new Date().toLocaleTimeString(),
        subject: formData.message.substring(0, 50),
        message: formData.message,
        from_name: formData.name, from_email: formData.email,
      });
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); setLoading(false); }, 3000);
    } catch { setLoading(false); }
  };

  return (
    <AnimatedSection id="contact" className="py-28 md:py-36 px-6 md:px-12 lg:px-24 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemUp} className="flex items-center gap-4 mb-8">
          <p className="section-label">[CONTACT]</p>
          <div className="flex-1 section-divider" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24">
          {/* Left Column: Heading, Text & Socials */}
          <div className="flex flex-col">
            <motion.h2 variants={itemUp} className="display-large mb-3">
              Let&apos;s <span className="text-accent-italic">connect</span>
            </motion.h2>
            <motion.p variants={itemUp} className="text-body-lg mb-12">
              I&apos;m always interested in new projects and opportunities. Drop a line!
            </motion.p>
            
            <motion.div variants={itemUp} className="flex flex-col gap-6">
              <a href="mailto:iteshxt@gmail.com" className="group !flex flex-row items-center gap-4 hover-underline w-max transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--foreground)' }}>
                <span className="w-12 h-12 border flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-white transition-all duration-300" style={{ borderColor: 'var(--border)' }}>
                  <Mail className="w-5 h-5" />
                </span>
                <div className="flex flex-col justify-center">
                  <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-40">Email</span>
                  <span className="font-mono text-sm tracking-wide">iteshxt@gmail.com</span>
                </div>
              </a>
              
              <a href="https://github.com/iteshxt" target="_blank" className="group !flex flex-row items-center gap-4 hover-underline w-max transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--foreground)' }}>
                <span className="w-12 h-12 border flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-white transition-all duration-300" style={{ borderColor: 'var(--border)' }}>
                  <SiGithub className="w-5 h-5" />
                </span>
                <div className="flex flex-col justify-center">
                  <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-40">Development</span>
                  <span className="font-mono text-sm tracking-wide">github.com/iteshxt</span>
                </div>
              </a>
              
              <a href="https://linkedin.com/in/iteshxt" target="_blank" className="group !flex flex-row items-center gap-4 hover-underline w-max transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--foreground)' }}>
                <span className="w-12 h-12 border flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-white transition-all duration-300" style={{ borderColor: 'var(--border)' }}>
                  <SiLinkedin className="w-5 h-5" />
                </span>
                <div className="flex flex-col justify-center">
                  <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-40">Professional</span>
                  <span className="font-mono text-sm tracking-wide">linkedin.com/in/iteshxt</span>
                </div>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div variants={itemUp}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-caption mb-2">Name</label>
                    <input type="text" id="name" required disabled={loading}
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-5 py-4 border text-sm focus:outline-none focus:border-[var(--accent)] transition-colors backdrop-blur-md"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 3%, transparent)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-caption mb-2">Email</label>
                    <input type="email" id="email" required disabled={loading}
                      value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-5 py-4 border text-sm focus:outline-none focus:border-[var(--accent)] transition-colors backdrop-blur-md"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 3%, transparent)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-caption mb-2">Message</label>
                  <textarea id="message" rows={6} required disabled={loading}
                    value={formData.message}
                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-5 py-4 border text-sm resize-none focus:outline-none focus:border-[var(--accent)] transition-colors backdrop-blur-md"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 3%, transparent)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    placeholder="Your message..."
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full px-5 py-4 flex items-center justify-center gap-3">
                  {loading ? 'SENDING...' : 'SEND MESSAGE'} <MoveRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-16 border bg-[var(--accent-bg)] h-full"
                style={{ borderColor: 'var(--accent)' }}
              >
                <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <p className="display-medium mb-3 text-center">Message Sent!</p>
                <p className="text-body text-center max-w-xs">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════ */
function FooterSection() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check local storage for explicit light theme preference
    if (localStorage.theme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      // Default to dark mode (if 'theme' is 'dark' or not set)
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const socials = [
    { label: 'GitHub', href: 'https://github.com/iteshxt', icon: <SiGithub className="w-4 h-4" /> },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/iteshxt', icon: <SiLinkedin className="w-4 h-4" /> },
    { label: 'LeetCode', href: 'https://leetcode.com/iteshxt', icon: <SiLeetcode className="w-4 h-4" /> },
    { label: 'Email', href: 'mailto:iteshxt@gmail.com', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <footer className="py-10 px-6 md:px-12 lg:px-24 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          Built with <Heart className="w-3 h-3 mx-0.5" style={{ color: 'var(--accent)' }} /> by Itesh © {new Date().getFullYear()}
        </p>
          
          <button 
            onClick={toggleTheme} 
            className="relative flex items-center border transition-colors group w-14 h-7 cursor-pointer" 
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
            title="Toggle Theme"
            aria-label="Toggle dark mode"
          >
            {/* The sliding square thumb */}
            <div 
              className="absolute top-0.5 bottom-0.5 w-[22px] bg-[var(--foreground)] transition-transform duration-300 ease-out z-10" 
              style={{ transform: isDark ? 'translateX(30px)' : 'translateX(2px)' }}
            />
            {/* The icons underneath */}
            <div className="absolute inset-0 flex justify-between items-center px-1.5 z-0 pointer-events-none">
              <Sun className="w-3 h-3" style={{ color: isDark ? 'var(--muted)' : 'var(--background)' }} />
              <Moon className="w-3 h-3" style={{ color: isDark ? 'var(--background)' : 'var(--muted)' }} />
            </div>
          </button>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════
   SCROLL TO TOP BUTTON
   ════════════════════════════════════════════════ */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] w-12 h-12 md:w-14 md:h-14 border flex items-center justify-center shrink-0 group hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-all duration-300 shadow-xl"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
          aria-label="Scroll to top"
        >
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 -rotate-90 group-hover:-translate-y-1 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════
   KEYBOARD NAVIGATION
   ════════════════════════════════════════════════ */
function KeyboardNavigation() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const labelMap: Record<string, string> = {
    '1': 'About', '2': 'Experience', '3': 'Education',
    '4': 'Certificates', '5': 'Projects', '6': 'Contact',
    '`': 'Home', '~': 'Home'
  };

  useEffect(() => {
    const keyMap: Record<string, string> = {
      '1': 'about', '2': 'experience', '3': 'education',
      '4': 'certificates', '5': 'projects', '6': 'contact',
      '`': 'hero', '~': 'hero'
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      const key = e.key;
      if (keyMap[key]) {
        e.preventDefault();
        setActiveKey(key);
        
        const section = document.getElementById(keyMap[key]);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setActiveKey(null);
        }, 1500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {activeKey && (
        <div className="fixed bottom-10 left-0 right-0 z-[100] hidden md:flex justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-4 px-6 py-3 border shadow-2xl pointer-events-auto"
            style={{ 
              backgroundColor: 'color-mix(in srgb, var(--background) 80%, transparent)', 
              backdropFilter: 'blur(16px)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center justify-center w-8 h-8 border text-sm font-bold font-mono" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}>
              {activeKey}
            </div>
            <span className="font-mono text-sm tracking-widest uppercase font-semibold" style={{ color: 'var(--foreground)' }}>
              Navigating to {labelMap[activeKey]}
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <CrosshairCursor />
      <KeyboardNavigation />
      <Nav />
      <HeroSection />
      <TechMarquee />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <CertificatesSection />
      <ProjectsSection />
      <ContactSection />
      <FooterSection />
      <ScrollToTopButton />
    </>
  );
}