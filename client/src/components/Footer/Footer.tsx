import React from 'react';
import cl from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={cl.outer}>
            <p>© {new Date().getFullYear()} year</p>
            <div className={cl.linksContainer}>
                <a
                    href="#"
                >
                    Privacy policy
                </a>
                <a
                    href="#"
                >
                    Terms of use
                </a>
            </div>
        </footer>
    );
};

export default Footer;