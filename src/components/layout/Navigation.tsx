'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { formatNavLabel } from '@/lib/utils';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { AudioControl } from '@/components/common/AudioControl';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navigation = ({ audioSrc }: { audioSrc: string }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
    <nav 
      className="fixed top-0 left-0 right-0 h-auto flex items-center justify-between px-3 sm:px-4 md:px-8 py-3 sm:py-4 z-40 transition-all duration-300 bg-background/70"
      style={
        isScrolled || mobileMenuOpen ? {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        } : {}
      }
    >
      <style>{`
        @keyframes underlineExpand {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        
        .nav-link-underline {
          position: relative;
          display: inline-block;
        }
        
        .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: currentColor;
          transition: width 0.3s ease-out;
        }
        
        .nav-link-underline.active::after {
          animation: underlineExpand 0.4s ease-out forwards;
        }
        
        .nav-link-underline:hover::after {
          animation: underlineExpand 0.3s ease-out forwards;
        }
      `}</style>
      
      {/* Home Icon - Left Side */}
      <Link
        href="/"
        className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg hover:bg-foreground/10 transition-colors font-mono font-bold text-lg sm:text-xl"
        title="Home"
      >
        IT
      </Link>

      {/* Navigation Links - Right Aligned (Hidden on small screens, visible on md+) */}
      <div className="hidden md:flex items-center gap-8 lg:gap-12 ml-auto mr-8 lg:mr-12">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))
            }
          />
        ))}
      </div>

      {/* Toggle Components - Far Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        <AudioControl audioSrc={audioSrc} />
        <div className="w-px h-4 sm:h-6 bg-foreground/10" />
        <ThemeToggle />
        
        {/* Mobile Menu Button (visible on small screens only) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-foreground/10 transition-colors"
          title="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
    </nav>

      {/* Mobile Menu Dropdown with Backdrop Blur - SEPARATE ELEMENT */}
      {mobileMenuOpen && (
        <>
          {/* Overlay to close menu on outside click */}
          <div 
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div 
            className="fixed left-0 right-0 w-full z-50 md:hidden"
            style={{
              top: 'calc(var(--navbar-height, 64px))',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(var(--background), 0.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background/70 border-t border-foreground/10">
              <div className="flex flex-col items-center px-4 py-4 gap-3">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-mono font-semibold transition-colors py-2 px-3 rounded ${
                      pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                        ? 'text-foreground bg-foreground/10'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {formatNavLabel(item.number, item.label)}
                  </Link>
                ))}
              </div>
              <div className="border-b border-foreground/10" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

const NavItem = ({
  item,
  isActive,
}: {
  item: (typeof NAV_ITEMS)[0];
  isActive: boolean;
}) => {
  return (
    <Link
      href={item.href}
      className={`nav-link-underline ${isActive ? 'active' : ''} text-base font-semibold transition-colors whitespace-nowrap font-mono ${
        isActive
          ? 'text-foreground'
          : 'text-foreground/70 hover:text-foreground'
      }`}
      title={formatNavLabel(item.number, item.label)}
    >
      {formatNavLabel(item.number, item.label)}
    </Link>
  );
};
