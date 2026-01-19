import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationLinks } from '../../data/portfolioData';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = ({ currentTheme, toggleTheme }) => {
    const location = useLocation();
    const navMenuRef = useRef(null);
    const navLinksRef = useRef([]);
    const [iconFading, setIconFading] = useState(false);

    // Enhanced toggle theme function with animation
    const handleToggleTheme = () => {
        // Add the ripple effect class
        const themeButton = document.querySelector('.theme-toggle-button');
        if (themeButton) {
            themeButton.classList.add('clicked');

            // Remove ripple class after animation completes
            setTimeout(() => {
                themeButton.classList.remove('clicked');
            }, 600);
        }

        // Fade out current icon
        setIconFading(true);

        // Toggle theme immediately while icon is fading
        toggleTheme();

        // Reset icon fading state after animation completes
        setTimeout(() => {
            setIconFading(false);
        }, 300);
    };

    // Function to check if a link should be considered active
    const isLinkActive = (linkHref) => {
        // Exact match for most links
        if (location.pathname === linkHref) {
            return true;
        }

        // Special case for project detail pages
        if (linkHref === '/projects' && location.pathname.startsWith('/projects/')) {
            return true;
        }

        return false;
    };

    // Animation for the sliding pill indicator
    useEffect(() => {
        if (navLinksRef.current.length > 0 && navMenuRef.current) {
            // Find the active link
            const activeLink = navLinksRef.current.find(
                (ref) => ref && (
                    ref.getAttribute('data-href') === location.pathname ||
                    (ref.getAttribute('data-href') === '/projects' && location.pathname.startsWith('/projects/'))
                )
            );

            const navMenu = navMenuRef.current;

            if (activeLink) {
                // Add active class to show the indicator
                navMenu.classList.add('has-active');

                // Position and size the indicator to match the active link
                const menuRect = navMenu.getBoundingClientRect();
                const linkRect = activeLink.getBoundingClientRect();

                const leftOffset = activeLink.offsetLeft;
                const width = activeLink.offsetWidth;

                navMenu.style.setProperty('--indicator-left', `${leftOffset}px`);
                navMenu.style.setProperty('--indicator-width', `${width}px`);
            } else {
                // No active link, hide indicator
                navMenu.classList.remove('has-active');
            }
        }
    }, [location.pathname]);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Navigation Menu - visible on all screen sizes */}
                <div className="nav-menu" ref={navMenuRef}>
                    {navigationLinks.map((link, index) => (
                        <Link
                            key={link.id}
                            to={link.href}
                            data-href={link.href}
                            className={`nav-link ${isLinkActive(link.href) ? 'nav-link-active' : ''}`}
                            ref={(el) => (navLinksRef.current[index] = el)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Theme Toggle Button */}
                <button
                    onClick={handleToggleTheme}
                    className="theme-toggle-button"
                    aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
                >
                    {currentTheme === 'light' ? (
                        <FaMoon className={`theme-icon ${iconFading ? 'fade-out' : 'fade-in'}`} />
                    ) : (
                        <FaSun className={`theme-icon ${iconFading ? 'fade-out' : 'fade-in'}`} />
                    )}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;