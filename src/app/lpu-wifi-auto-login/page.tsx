'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Zap, Clock, Lock, Wifi, User, Bell, Trash2, Puzzle, 
  Sun, Moon, Mail
  } from 'lucide-react';

/* ════════════════════════════════════════════════
   CROSSHAIR CURSOR
   Full-viewport X/Y lines + solid accent square
   ════════════════════════════════════════════════ */
function CrosshairCursor() {
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

const steps = [
  {
    number: '01',
    title: 'Instant Check',
    description:
      'On browser launch, the extension silently pings Google. If you\'re already online, it goes back to sleep — no unnecessary requests.',
  },
  {
    number: '02',
    title: 'Stealth Login',
    description:
      'If the LPU portal is blocking your connection, it fetches the login page, extracts all dynamic security tokens, bypasses the CAPTCHA, and submits your credentials automatically.',
  },
  {
    number: '03',
    title: 'Background Guardian',
    description:
      'A configurable timer (default: 30 min) periodically verifies your connection and re-authenticates if LPU logs you out — your internet never drops mid-task.',
  },
];

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Fully Automatic',
    desc: 'Works silently in the background. No manual action ever needed after setup.',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Configurable Interval',
    desc: 'Choose your check frequency from 1 minute to 1 hour via the Settings panel.',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Secure Storage',
    desc: 'Credentials are Base64-encoded and stored only in Chrome\'s local storage. Never leaves your device.',
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    title: 'Live Status Dashboard',
    desc: 'Real-time connection status with visual indicators — Connected, Connecting, or Disconnected.',
  },
  {
    icon: <User className="w-5 h-5" />,
    title: 'Profile Card',
    desc: 'See your name and registration number at a glance on the dashboard.',
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: 'Toast Notifications',
    desc: 'Subtle notifications for every connection event, right in the popup.',
  },
  {
    icon: <Trash2 className="w-5 h-5" />,
    title: 'Easy Credential Reset',
    desc: 'One-click credential removal from the Settings tab whenever you need it.',
  },
  {
    icon: <Puzzle className="w-5 h-5" />,
    title: 'Manifest V3',
    desc: 'Built on Chrome\'s latest extension platform — lightweight, modern, and secure.',
  },
];

const installSteps = [
  {
    step: '01',
    title: 'Download the ZIP',
    desc: (
      <>
        Go to the{' '}
        <a
          href="https://github.com/iteshxt/lpu-wifi-automate-login/releases"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)' }}
        >
          Releases Page
        </a>{' '}
        and download the latest ZIP. Extract it anywhere on your computer.
      </>
    ),
  },
  {
    step: '02',
    title: 'Open Chrome Extensions',
    desc: (
      <>
        Type{' '}
        <code style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8em',
          background: 'var(--accent-bg)',
          color: 'var(--accent)',
          padding: '2px 8px',
          border: '1px solid var(--border)',
        }}>
          chrome://extensions/
        </code>{' '}
        in your address bar and press Enter.
      </>
    ),
  },
  {
    step: '03',
    title: 'Enable Developer Mode',
    desc: 'Toggle the Developer mode switch in the top-right corner of the Extensions page.',
  },
  {
    step: '04',
    title: 'Load Unpacked',
    desc: 'Click "Load unpacked", then navigate to the extracted folder and select the inner chrome-extension folder.',
  },
  {
    step: '05',
    title: 'Pin & Configure',
    desc: (
      <>
        Click the puzzle piece <Puzzle className="w-3 h-3 inline pb-0.5" /> icon in Chrome's toolbar, pin LPU WiFi, click it, enter your credentials, and you're done.
      </>
    ),
  },
];

const privacySections = [
  {
    title: 'Overview',
    content: (
      <p>
        LPU WiFi Auto Login (&quot;the Extension&quot;) is built to do one thing: automatically log you into the Lovely Professional University captive portal WiFi. Your privacy is a priority. This policy explains exactly what data is touched and why.
      </p>
    ),
  },
  {
    title: 'Data We Collect & Store',
    content: (
      <>
        <p style={{ marginBottom: '1rem' }}>
          The Extension stores the following data <strong>locally on your device only</strong> using Chrome&apos;s{' '}
          <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8em', background: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 8px', border: '1px solid var(--border)' }}>
            chrome.storage.local
          </code>{' '}API:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            ['Full Name', 'Used only to display your profile card inside the popup. Never transmitted.'],
            ['Registration Number', 'Your LPU student ID, used as the login username. Stored with Base64 encoding. Transmitted only to internet.lpu.in.'],
            ['WiFi Password', 'Your LPU portal password, stored with Base64 encoding. Transmitted only to internet.lpu.in.'],
          ].map(([term, def]) => (
            <li key={term} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1rem' }}>
              <span style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{term}</span>
              <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{def}</p>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: '1rem', fontWeight: 600 }}>
          No data is ever sent to any server other than LPU&apos;s own captive portal.
        </p>
      </>
    ),
  },
  {
    title: 'Network Requests Made',
    content: (
      <>
        <p style={{ marginBottom: '1rem' }}>The Extension makes requests to exactly two hosts:</p>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            ['internet.lpu.in', "LPU's own captive portal. Used to fetch the login page and submit your credentials for authentication."],
            ['clients3.google.com/generate_204', 'A standard HTTP 204 connectivity probe to detect whether you already have internet access. No user data is sent in this request.'],
          ].map(([host, desc]) => (
            <li key={host as string} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1rem' }}>
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8em', background: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 8px', border: '1px solid var(--border)' }}>{host}</code>
              <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: 'Data Sharing',
    content: (
      <>
        <p style={{ marginBottom: '1rem' }}>We do <strong>not</strong>:</p>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            'Sell or transfer your data to any third party',
            'Use your data for any purpose unrelated to WiFi authentication',
            'Send your data to any analytics, tracking, or advertising service',
            'Store any data on external servers',
          ].map((item) => (
            <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>—</span>
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: 'Permissions Used',
    content: (
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[
          ['storage', "To save your credentials locally in Chrome's local storage."],
          ['alarms', 'To schedule periodic background connection checks (default every 30 minutes).'],
          ['host permissions (internet.lpu.in)', 'To interact with the LPU captive portal for authentication.'],
          ['host permissions (clients3.google.com)', 'To perform the connectivity probe without requiring full internet access permissions.'],
        ].map(([perm, desc]) => (
          <li key={perm as string} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1rem' }}>
            <span style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{perm}</span>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Remote Code',
    content: (
      <p>
        This Extension does <strong>not</strong> use any remote code. All JavaScript is bundled within the extension package (
        <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8em', background: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 8px', border: '1px solid var(--border)' }}>background.js</code>
        ,{' '}
        <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8em', background: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 8px', border: '1px solid var(--border)' }}>popup.js</code>
        ). No external scripts are loaded, and{' '}
        <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8em', background: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 8px', border: '1px solid var(--border)' }}>eval()</code>{' '}
        is not used anywhere.
      </p>
    ),
  },
  {
    title: 'Removing Your Data',
    content: (
      <p>
        You can delete all stored data at any time by opening the Extension popup → Settings → <strong>Remove Saved Credentials</strong>. This permanently clears your name, registration number, and password from local storage and disables auto-login.
      </p>
    ),
  },
  {
    title: 'Contact',
    content: (
      <p>
        If you have any questions about this privacy policy, contact the developer at{' '}
        <a href="https://github.com/iteshxt" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)' }}>
          github.com/iteshxt
        </a>{' '}
        or via{' '}
        <a href="https://iteshxt.me" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)' }}>
          iteshxt.me
        </a>
        .
      </p>
    ),
  },
];

export default function LPUWifiPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (localStorage.theme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
      <CrosshairCursor />
      <style>{`
        .feature-card { background-color: var(--background); padding: 1.5rem; transition: background-color 0.2s; }
        .feature-card:hover { background-color: var(--accent-bg); }
        section { scroll-margin-top: 100px; }
      `}</style>

      {/* Fractal Grid Background */}
      <div className="fractal-grid" />

      {/* Minimal Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: 'color-mix(in srgb, var(--background) 85%, transparent)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          ← Back to Portfolio
        </Link>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.5 }}>
          iteshxt.me
        </span>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '6rem', paddingBottom: '4rem' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '2rem',
            fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
            fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            padding: '0.4rem 0.875rem',
            width: 'fit-content',
            backgroundColor: 'var(--accent-bg)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'inline-block', animation: 'pulse-glow 2s ease-in-out infinite' }} />
            Chrome Extension · Manifest V3 · v2.2.1
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            color: 'var(--foreground)',
            marginBottom: '1.5rem',
          }}>
            LPU WiFi{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400, fontFamily: 'Georgia, serif' }}>
              Auto Login
            </em>
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
            lineHeight: 1.65,
            color: 'var(--muted)',
            maxWidth: '560px',
            marginBottom: '3rem',
          }}>
            Set it once. Stay connected forever.<br />
            Never manually log into the LPU captive portal again.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <a
              href="https://github.com/iteshxt/lpu-wifi-automate-login/releases"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              ↓ Download Extension
            </a>
            <a
              href="https://github.com/iteshxt/lpu-wifi-automate-login"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              View on GitHub ↗
            </a>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0 0 6rem' }} />

        {/* ── HOW IT WORKS ── */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
            [ HOW IT WORKS ]
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '3rem' }}>
            Three steps,{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400, fontFamily: 'Georgia, serif' }}>zero effort</em>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5px', backgroundColor: 'var(--border)' }}>
            {steps.map((s) => (
              <div key={s.number} style={{
                backgroundColor: 'var(--background)',
                padding: '2rem',
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '3rem',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: 'var(--accent)',
                  opacity: 0.2,
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.04em',
                }}>
                  {s.number}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                  {s.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
            [ FEATURES ]
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '3rem' }}>
            Everything{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400, fontFamily: 'Georgia, serif' }}>you need</em>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', backgroundColor: 'var(--border)' }}>
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={{ color: 'var(--accent)', marginBottom: '0.75rem', lineHeight: 1 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── INSTALLATION ── */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
            [ INSTALLATION ]
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '3rem' }}>
            Up and running in{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400, fontFamily: 'Georgia, serif' }}>2 minutes</em>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderLeft: '1px solid var(--border)' }}>
            {installSteps.map((s, i) => (
              <div key={s.step} style={{
                display: 'flex',
                gap: '2rem',
                padding: '2rem',
                borderBottom: i < installSteps.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: 'var(--accent)',
                  flexShrink: 0,
                  paddingTop: '0.15rem',
                  width: '2rem',
                }}>
                  {s.step}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.015em', marginBottom: '0.5rem' }}>{s.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRIVACY POLICY ── */}
        <section id="privacy" style={{ marginBottom: '6rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
            [ PRIVACY POLICY ]
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '0.75rem' }}>
            Your data,{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 400, fontFamily: 'Georgia, serif' }}>your device</em>
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.6, marginBottom: '3rem' }}>
            Last updated: April 2, 2025 &nbsp;·&nbsp; Effective immediately
          </p>

          <div style={{ border: '1px solid var(--border)' }}>
            {privacySections.map((section, i) => (
              <div key={section.title} style={{
                padding: '2rem',
                borderBottom: i < privacySections.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  opacity: 0.6,
                  marginBottom: '0.75rem',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                  {section.title}
                </h3>
                <div style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '3rem' }} />

        {/* ── FOOTER ── */}
        <footer style={{ paddingBottom: '4rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>
              Built by{' '}
              <a href="https://iteshxt.me" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                Itesh Tomar
              </a>{' '}
              · Open source on{' '}
              <a href="https://github.com/iteshxt/lpu-wifi-automate-login" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                GitHub
              </a>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <a href="mailto:iteshxt@gmail.com" style={{ 
                fontFamily: "'JetBrains Mono', monospace", 
                fontSize: '0.6rem', 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase', 
                color: 'var(--accent)', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Mail className="w-3 h-3" /> iteshxt@gmail.com
              </a>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.4 }}>
                Contributions welcome · MIT License
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button 
              onClick={toggleTheme} 
              className="relative flex items-center border transition-colors group w-12 h-6 cursor-pointer" 
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
              title="Toggle Theme"
            >
              <div 
                className="absolute top-0.5 bottom-0.5 w-[20px] bg-[var(--foreground)] transition-transform duration-300 ease-out z-10" 
                style={{ transform: isDark ? 'translateX(24px)' : 'translateX(2px)' }}
              />
              <div className="absolute inset-0 flex justify-between items-center px-1.5 z-0 pointer-events-none">
                <Sun className="w-2.5 h-2.5" style={{ color: isDark ? 'var(--muted)' : 'var(--background)' }} />
                <Moon className="w-2.5 h-2.5" style={{ color: isDark ? 'var(--background)' : 'var(--muted)' }} />
              </div>
            </button>

            <Link href="/" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              textDecoration: 'none',
              border: '1px solid var(--border)',
              padding: '0.5rem 1rem',
              transition: 'border-color 0.2s, color 0.2s',
            }}>
              ← Portfolio
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
