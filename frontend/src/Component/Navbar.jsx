import React, { useState } from 'react';
import '../Css/Navbar.css';
import logo from '../assets/react.svg';
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-content">
                        {/* Mobile menu button */}
                        <div className="mobile-menu-button">
                            <button 
                                type="button" 
                                className="hamburger-button"
                                onClick={toggleMobileMenu}
                                aria-controls="mobile-menu" 
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {/* Hamburger icon */}
                                <svg 
                                    className="icon"
                                    style={{display: isMobileMenuOpen ? 'none' : 'block'}}
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth="1.5" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                {/* Close icon */}
                                <svg 
                                    className="icon"
                                    style={{display: isMobileMenuOpen ? 'block' : 'none'}}
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth="1.5" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="main-content">
                            {/* Logo */}
                            <div className="logo">
                                <img 
                                    className="logo-image" 
                                    src= {logo}
                                    alt="KunchaExpress" 
                                />
                            </div>

                            {/* Desktop menu */}
                            <div className="desktop-menu">
                                <div className="menu-links">
                                    <a href="#" className="nav-link active">Dashboard</a>
                                    <a href="#" className="nav-link">MAP</a>
                                    <a href="#" className="nav-link">Calendar</a>
                                </div>
                            </div>
                        </div>

                        {/* Right side content */}
                        <div className="right-content">
                            {/* Notification button */}
                            <button type="button" className="notification-button">
                                <span className="sr-only">View notifications</span>
                                <svg className="icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>
                            </button>

                            {/* User menu */}
                            <div className="user-menu-container">
                                <div>
                                    <button 
                                        type="button" 
                                        className="user-button"
                                        onClick={toggleUserMenu}
                                        aria-expanded={isUserMenuOpen}
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img 
                                            className="user-image" 
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                                            alt="" 
                                        />
                                    </button>
                                </div>

                                {/* User dropdown menu */}
                                {isUserMenuOpen && (
                                    <div className="user-dropdown">
                                        <a href="#" className="dropdown-item">Your Profile</a>
                                        <a href="#" className="dropdown-item">Settings</a>
                                        <a href="#" className="dropdown-item">Sign out</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        <div className="mobile-menu-content">
                            <a href="#" className="mobile-link active">Dashboard</a>
                            <a href="#" className="mobile-link">Team</a>
                            <a href="#" className="mobile-link">Projects</a>
                            <a href="#" className="mobile-link">Calendar</a>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;