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

  const accentColor = theme === 'dark' ? '#8b5cf6' : '#8b5cf6';
  const accentColorBorder = theme === 'dark' ? '#5227FF' : '#e4e4e7';

  const handleResumeClick = () => {
    window.open('/resume.pdf', '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:iteshxt@gmail.com', '_blank');
  };

  return (
    <section className="relative flex flex-col items-center justify-center lg:min-h-screen lg:justify-start lg:pt-32 px-4 sm:px-6 md:px-8 pb-0 min-h-screen">
      {/* Mobile & Tablet Layout (up to lg breakpoint) */}
      <div className="lg:hidden w-full max-w-2xl mx-auto flex flex-col items-start gap-2.5 sm:gap-3 md:gap-4">
        {/* Greeting and Name Section - Aligned with text below */}
        <div className="pl-0 sm:pl-0">
          {/* Greeting at top */}
          <animated.p
            style={greetingSpring}
            className="text-sm sm:text-base text-foreground/60 font-light tracking-wider text-left mb-3 sm:mb-4"
          >
            Hi👋, my name is
          </animated.p>

          {/* Name with Image Side by Side */}
          <div className="flex flex-col w-full gap-0 mb-1 sm:mb-2">
            {/* Name and Ghost on same line */}
            <div className="flex items-start gap-1 sm:gap-3 md:gap-4 mb-0">
              <animated.h1 
                style={nameSpring}
                className="text-[3.75rem] leading-[0.95] sm:text-5xl md:text-6xl sm:leading-[0.9] font-bold text-foreground m-0 p-0"
              >
                Itesh Tomar
              </animated.h1>
              
              {/* Ghost Icon - Right side, closer to name */}
              <animated.div
                style={{
                  opacity: useSpring({
                    from: { opacity: 0, transform: 'translate3d(40px, 0px, 0)' },
                    to: { opacity: 1, transform: 'translate3d(0px, 0px, 0)' },
                    delay: 100,
                  }).opacity,
                }}
                className="shrink-0 -mt-4 sm:-mt-2 -ml-8 sm:-ml-4"
              >
                <Image
                  src="/icon.svg"
                  alt="Itesh Tomar"
                  width={200}
                  height={200}
                  className="w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 scale-x-[-1] opacity-100"
                />
              </animated.div>
            </div>
          </div>
          
          {/* Tagline below everything - separate from flex container */}
          <animated.p
            style={{
              ...taglineSpring,
              color: accentColor,
            }}
            className="text-sm sm:text-base md:text-lg font-light leading-tight mt-1 sm:mt-2 m-0 p-0 text-left w-full max-w-sm"
          >
            I build things that sometimes work :)
          </animated.p>
        </div>

        {/* Description */}
        <animated.p
          style={descriptionSpring}
          className="text-[0.9rem] sm:text-base text-foreground/70 w-full leading-relaxed pt-4"
        >
          Software Developer crafting interactive web experiences. I specialize in turning complex ideas into pixel-perfect, performant applications. Currently exploring AI-powered tools and building products that blend creativity with code.
        </animated.p>

        {/* Buttons */}
        <animated.div
          style={buttonsSpring}
          className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto pt-6"
        >
          <button
            onClick={handleResumeClick}
            className="btn-primary text-sm sm:text-base w-full sm:w-auto"
          >
            View Resume
          </button>
          <button
            onClick={handleEmailClick}
            className="btn-secondary text-sm sm:text-base w-full sm:w-auto"
          >
            Get In Touch
          </button>
        </animated.div>

        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-foreground/40 w-full pb-0">
          <p>Press 1-5 to navigate • 🎮 Keyboard shortcuts available</p>
        </div>
      </div>

      {/* Desktop Layout - Large screens only */}
      <div className="hidden lg:flex w-full items-center justify-center relative">
        {/* Large Icon - Right Side (Desktop Only) - Responsive sizing */}
        <animated.div
          style={{
            opacity: useSpring({
              from: { opacity: 0, transform: 'translate3d(40px, 0px, 0)' },
              to: { opacity: 1, transform: 'translate3d(0px, 0px, 0)' },
              delay: 100,
            }).opacity,
          }}
          className="absolute right-8 xl:right-20 2xl:right-32 top-1/2 -translate-y-1/2 z-0"
        >
          <Image
            src="/icon.svg"
            alt="Itesh Tomar"
            width={1600}
            height={1600}
            className="scale-x-[-1] opacity-100"
            style={{ 
              width: 'clamp(400px, 40vw, 768px)', 
              height: 'clamp(400px, 40vw, 768px)',
              maxWidth: '768px',
              maxHeight: '768px'
            }}
          />
        </animated.div>

        <div className="flex flex-col items-start justify-center gap-8 z-10 w-full max-w-7xl mx-auto pl-0 xl:pl-8 2xl:pl-16">
          {/* Content Container */}
          <div className="flex flex-col items-start justify-start gap-6 text-left w-full max-w-xl xl:max-w-2xl">
            {/* Greeting */}
            <animated.p
              style={greetingSpring}
              className="text-base lg:text-lg text-foreground/60 font-light tracking-wider"
            >
              Hi👋, my name is
            </animated.p>

            {/* Name - Creative Text */}
            <animated.div style={nameSpring} className="space-y-2 w-full">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground">
                Itesh Tomar
              </h1>
              <animated.p
                style={{
                  ...taglineSpring,
                  color: accentColor,
                }}
                className="text-2xl lg:text-3xl xl:text-4xl font-light"
              >
                I build things that sometimes work :)
              </animated.p>
            </animated.div>

            {/* Description - Subtitle */}
            <animated.p
              style={descriptionSpring}
              className="text-base lg:text-lg text-foreground/70 w-full leading-relaxed pt-4 max-w-xl"
            >
              Software Developer crafting interactive web experiences. I specialize in turning complex ideas into pixel-perfect, performant applications. Currently exploring AI-powered tools and building products that blend creativity with code.
            </animated.p>

            {/* Buttons */}
            <animated.div
              style={buttonsSpring}
              className="flex flex-row gap-4 pt-8"
            >
              <button
                onClick={handleResumeClick}
                className="btn-primary"
              >
                View Resume
              </button>
              <button
                onClick={handleEmailClick}
                className="btn-secondary"
              >
                Get In Touch
              </button>
            </animated.div>

            <div className="mt-12 text-xs lg:text-sm text-foreground/40">
              <p>Press 1-5 to navigate • 🎮 Keyboard shortcuts available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}