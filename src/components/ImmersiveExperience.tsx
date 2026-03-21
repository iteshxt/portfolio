'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '@/data/portfolio';
import { Github, ExternalLink, Mail, Heart, ArrowDown } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════════
   3D IMMERSIVE EXPERIENCE
   CSS 3D transforms + GSAP ScrollTrigger
   Scroll-driven tunnel navigation through sections
   ════════════════════════════════════════════════ */

interface TunnelSection {
  id: string;
  label: string;
  content: React.ReactNode;
}

function TunnelPanel({ section, index }: { section: TunnelSection; index: number }) {
  return (
    <div
      className="tunnel-panel"
      data-index={index}
      style={{
        transform: `translateZ(${-index * 100}vh)`,
        zIndex: 100 - index,
      }}
    >
      <div className="tunnel-panel-inner">
        <div className="tunnel-panel-content">
          {section.content}
        </div>
      </div>
    </div>
  );
}

/* ═══ Section Contents ═══ */

function ImmersiveHero() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <p className="text-caption mb-4" style={{ color: 'var(--accent)' }}>
        [ WELCOME TO THE EXPERIENCE ]
      </p>
      <h1 className="display-hero mb-6">
        Itesh<br />Tomar
      </h1>
      <p className="display-medium max-w-lg" style={{ color: 'var(--muted)' }}>
        Crafting <span className="text-accent-italic">digital</span> experiences
      </p>
      <div className="mt-12 flex items-center gap-2 animate-bounce">
        <ArrowDown className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        <span className="text-caption">Scroll to dive in</span>
      </div>
    </div>
  );
}

function ImmersiveAbout() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-3xl mx-auto">
      <p className="text-caption mb-4" style={{ color: 'var(--accent)' }}>[ ABOUT ]</p>
      <h2 className="display-huge mb-8">
        Solving <span className="text-accent-italic">code</span><br />Problems
      </h2>
      <p className="text-body-lg max-w-xl">
        Software Developer crafting interactive web experiences. I specialize in turning complex ideas into pixel-perfect, performant applications.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl">
        {Object.entries(portfolioData.skills).filter(([key]) => key !== 'soft').slice(0, 4).map(([category, skills]) => (
          <div key={category} className="text-left">
            <p className="text-caption mb-2" style={{ color: 'var(--accent)' }}>{category}</p>
            <div className="flex flex-wrap gap-1">
              {(skills as string[]).slice(0, 4).map((skill) => (
                <span key={skill} className="font-mono text-[10px] px-1.5 py-0.5 border" style={{ borderColor: 'var(--border)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImmersiveExperience() {
  const job = portfolioData.experience[0];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-3xl mx-auto">
      <p className="text-caption mb-4" style={{ color: 'var(--accent)' }}>[ EXPERIENCE ]</p>
      <h2 className="display-large mb-2">{job.title}</h2>
      <p className="text-sm font-medium mb-6" style={{ color: 'var(--accent)' }}>
        {job.company} · {job.location}
      </p>
      <p className="text-body max-w-lg mb-8">{job.description}</p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {job.technologies.map((tech) => (
          <span key={tech} className="font-mono text-xs px-2 py-0.5 border" style={{ borderColor: 'var(--border)' }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function ImmersiveProjects() {
  const featured = portfolioData.projects.featured.slice(0, 3);
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-4xl mx-auto">
      <p className="text-caption mb-4" style={{ color: 'var(--accent)' }}>[ PROJECTS ]</p>
      <h2 className="display-large mb-12 text-center">
        Selected <span className="text-accent-italic">works</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {featured.map((project, idx) => (
          <div key={project.id} className="project-card p-5 text-left">
            <span className="text-caption" style={{ color: 'var(--accent)' }}>0{idx + 1}</span>
            <h4 className="mt-1 mb-2">{project.title}</h4>
            <p className="text-body-sm mb-4 line-clamp-3">{project.description}</p>
            <div className="flex gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <Link href={project.github} target="_blank" rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--muted)' }}>
                <Github className="w-4 h-4" />
              </Link>
              {project.live && (
                <Link href={project.live} target="_blank" rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--muted)' }}>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImmersiveContact() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-2xl mx-auto">
      <p className="text-caption mb-4" style={{ color: 'var(--accent)' }}>[ CONTACT ]</p>
      <h2 className="display-large mb-4">
        Let&apos;s <span className="text-accent-italic">connect</span>
      </h2>
      <p className="text-body-lg mb-10">
        I&apos;m always interested in new projects and opportunities.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <a href="mailto:iteshxt@gmail.com" className="btn-primary">
          <Mail className="w-4 h-4" /> SAY HELLO
        </a>
        <Link href="https://github.com/iteshxt" target="_blank" className="btn-secondary">
          <Github className="w-4 h-4" /> GITHUB
        </Link>
      </div>
      <p className="flex items-center gap-1.5 text-xs mt-16" style={{ color: 'var(--muted)' }}>
        Designed & Built with <Heart className="w-3 h-3" style={{ color: 'var(--accent)' }} /> by Itesh
      </p>
    </div>
  );
}

/* ═══ Main Tunnel Component ═══ */

export default function ImmersiveExperienceMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sections: TunnelSection[] = [
    { id: 'hero', label: 'Home', content: <ImmersiveHero /> },
    { id: 'about', label: 'About', content: <ImmersiveAbout /> },
    { id: 'experience', label: 'Experience', content: <ImmersiveExperience /> },
    { id: 'projects', label: 'Projects', content: <ImmersiveProjects /> },
    { id: 'contact', label: 'Contact', content: <ImmersiveContact /> },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const tunnel = tunnelRef.current;
    if (!container || !tunnel) return;

    const totalSections = sections.length;
    const totalDepth = (totalSections - 1) * 100; // in vh units mapped to px

    // Animate the tunnel's translateZ on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${totalSections * 100}%`,
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (totalSections - 1));
          setActiveIndex(idx);
        },
      },
    });

    // Move the tunnel forward (positive Z) as user scrolls
    tl.to(tunnel, {
      z: totalDepth,
      ease: 'none',
      duration: 1,
    }, 0);

    // Fade panels in/out
    const panels = tunnel.querySelectorAll('.tunnel-panel');
    panels.forEach((panel, i) => {
      if (i === 0) return; // First panel already visible
      const startProgress = (i - 0.5) / totalSections;
      const endProgress = i / totalSections;

      tl.fromTo(panel, {
        opacity: 0,
      }, {
        opacity: 1,
        duration: (endProgress - startProgress),
        ease: 'none',
      }, startProgress);
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="immersive-wrapper" ref={containerRef}>
      {/* Progress dots */}
      <div className="tunnel-nav">
        {sections.map((s, i) => (
          <button
            key={s.id}
            className={`tunnel-nav-dot ${i === activeIndex ? 'active' : ''}`}
            title={s.label}
            onClick={() => {
              /* Scroll to the right position */
              const totalScroll = containerRef.current?.scrollHeight || window.innerHeight;
              const targetScroll = (i / (sections.length - 1)) * (totalScroll - window.innerHeight);
              window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }}
          >
            <span className="tunnel-nav-label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* 3D Tunnel viewport */}
      <div className="tunnel-viewport">
        <div className="tunnel-scene" ref={tunnelRef}>
          {/* Grid wireframe walls */}
          <div className="tunnel-wall tunnel-wall-left" />
          <div className="tunnel-wall tunnel-wall-right" />
          <div className="tunnel-wall tunnel-wall-top" />
          <div className="tunnel-wall tunnel-wall-bottom" />

          {/* Section panels placed at depths */}
          {sections.map((section, index) => (
            <TunnelPanel key={section.id} section={section} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
