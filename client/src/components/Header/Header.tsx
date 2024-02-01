import React from 'react';
import cl from './Header.module.css';
import Button from "../../UI/Button/Button";
import {useNavigate} from "react-router-dom";
import Navigation from "./Navigation/Navigation";

const Header = () => {
    const navigate = useNavigate();

    const goToHome = (): void => navigate('/');

    return (
        <header className={cl.outer}>
            <div>
                <p onClick={goToHome}>Logo Here</p>
            </div>
            <div className={cl.headerOptions}>
                <Navigation />
            </div>
        </header>
    );
};

export default Header;