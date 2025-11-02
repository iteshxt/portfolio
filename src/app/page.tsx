'use client';

import Image from 'next/image';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useTheme } from '@/hooks/useTheme';
import { animated, useSpring } from '@react-spring/web';

export default function Home() {
  useKeyboardNav();
  const { theme } = useTheme();

  const greetingSpring = useSpring({
    from: { opacity: 0, transform: 'translate3d(0, 20px, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
    delay: 100,
  });

  const nameSpring = useSpring({
    from: { opacity: 0, transform: 'translate3d(0, 40px, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
    delay: 200,
  });

  const taglineSpring = useSpring({
    from: { opacity: 0, transform: 'translate3d(0, 20px, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
    delay: 300,
  });

  const descriptionSpring = useSpring({
    from: { opacity: 0, transform: 'translate3d(0, 40px, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
    delay: 450,
  });

  const buttonsSpring = useSpring({
    from: { opacity: 0, transform: 'translate3d(0, 40px, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
    delay: 600,
  });

  const accentColor = theme === 'dark' ? '#8b5cf6' : '#d4d4d8';
  const accentColorBorder = theme === 'dark' ? '#5227FF' : '#e4e4e7';

  const handleResumeClick = () => {
    window.open('/resume.pdf', '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:iteshxt@gmail.com', '_blank');
  };

  return (
    <section className="relative md:min-h-screen flex flex-col md:flex-row items-center md:items-center justify-center md:justify-center px-3 md:px-8 md:py-20 md:pt-0">
      {/* Mobile Layout - Absolute centered from screen top */}
      <div className="md:hidden fixed inset-0 w-full h-screen flex flex-col items-center justify-center gap-3 py-0 pointer-events-auto">
        {/* Inner container for left-aligned content with padding */}
        <div className="w-full max-w-sm px-6 flex flex-col items-start gap-3">
          {/* Greeting at top */}
          <animated.p
            style={greetingSpring}
            className="text-sm text-foreground/60 font-light tracking-wider text-left"
          >
            Hi👋, my name is
          </animated.p>

          {/* Name with Image Side by Side */}
          <div className="flex items-start gap-3 w-full">
            {/* Content on Left */}
            <animated.div style={nameSpring} className="space-y-0 flex-1">
              <h1 className="text-6xl font-bold text-foreground leading-tight">
                Itesh Tomar
              </h1>
              <animated.p
                style={{
                  ...taglineSpring,
                  color: accentColor,
                }}
                className="text-sm font-light"
              >
                I build things that sometimes work :)
              </animated.p>
            </animated.div>

            {/* Mobile Icon - Larger, Next to Name */}
            <animated.div
              style={{
                opacity: useSpring({
                  from: { opacity: 0, transform: 'translate3d(40px, 0px, 0)' },
                  to: { opacity: 1, transform: 'translate3d(0px, 0px, 0)' },
                  delay: 100,
                }).opacity,
              }}
              className="z-50 shrink-0"
            >
              <Image
                src="/icon.svg"
                alt="Itesh Tomar"
                width={160}
                height={160}
                className="w-40 h-40 scale-x-[-1] opacity-100"
              />
            </animated.div>
          </div>

          {/* Description */}
          <animated.p
            style={descriptionSpring}
            className="text-xs text-foreground/70 w-full leading-relaxed"
          >
            Software Developer crafting interactive web experiences. I specialize in turning complex ideas into pixel-perfect, performant applications. Currently exploring AI-powered tools and building products that blend creativity with code.
          </animated.p>

          {/* Buttons - Not Full Width */}
          <animated.div
            style={buttonsSpring}
            className="flex flex-col gap-1.5 w-full max-w-xs pt-2"
          >
            <button
              onClick={handleResumeClick}
              className="btn-primary text-sm"
            >
              View Resume
            </button>
            <button
              onClick={handleEmailClick}
              className="btn-secondary text-sm"
            >
              Get In Touch
            </button>
          </animated.div>
        </div>
      </div>

      {/* Desktop Layout - Original */}
      <div className="hidden md:flex w-full items-center justify-center">
        {/* Top Icon - Right Side (Desktop Only) */}
        <animated.div
          style={{
            opacity: useSpring({
              from: { opacity: 0, transform: 'translate3d(40px, 0px, 0)' },
              to: { opacity: 1, transform: 'translate3d(0px, 0px, 0)' },
              delay: 100,
            }).opacity,
            transform: 'translateY(calc(-50% - 48px))',
          }}
          className="absolute right-32 top-1/2 z-50 hidden lg:block"
        >
          <Image
            src="/icon.svg"
            alt="Itesh Tomar"
            width={1600}
            height={1600}
            className="w-full h-full scale-x-[-1] opacity-100"
            style={{ width: '768px', height: '768px' }}
          />
        </animated.div>

        <div className="flex flex-col items-start justify-start gap-8 z-10 w-full pl-0 md:pl-32 lg:pl-80">
          {/* Content Container */}
          <div className="flex flex-col items-start justify-start gap-6 text-left w-full max-w-2xl">
            {/* Greeting */}
            <animated.p
              style={greetingSpring}
              className="text-xs sm:text-sm md:text-base text-foreground/60 font-light tracking-wider"
            >
              Hi👋, my name is
            </animated.p>

            {/* Name - Creative Text */}
            <animated.div style={nameSpring} className="space-y-2 w-full">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground whitespace-nowrap overflow-hidden">
                Itesh Tomar
              </h1>
              <animated.p
                style={{
                  ...taglineSpring,
                  color: accentColor,
                }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light"
              >
                I build things that sometimes work :)
              </animated.p>
            </animated.div>

            {/* Description - Subtitle */}
            <animated.p
              style={descriptionSpring}
              className="text-xs sm:text-sm md:text-base text-foreground/70 w-full leading-relaxed pt-4"
            >
              Software Developer crafting interactive web experiences. I specialize in turning complex ideas into pixel-perfect, performant applications. Currently exploring AI-powered tools and building products that blend creativity with code.
            </animated.p>

            {/* Buttons */}
            <animated.div
              style={buttonsSpring}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-8 w-full sm:w-auto"
            >
              <button
                onClick={handleResumeClick}
                className="btn-primary text-sm sm:text-base"
              >
                View Resume
              </button>
              <button
                onClick={handleEmailClick}
                className="btn-secondary text-sm sm:text-base"
              >
                Get In Touch
              </button>
            </animated.div>

            <div className="mt-8 sm:mt-12 text-xs text-foreground/40">
              <p>Press 1-5 to navigate • 🎮 Keyboard shortcuts available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
