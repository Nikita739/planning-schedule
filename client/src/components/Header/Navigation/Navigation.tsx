import React from 'react';
import useAuth from "../../../hooks/useAuth";
import {protectedNavigation, publicNavigation} from "../../../routing/routes";
import Button from "../../../UI/Button/Button";
import {useLocation, useNavigate} from "react-router-dom";
import cl from './Navigation.module.css';

const Navigation: React.FC = () => {
    const urlPath = useLocation().pathname;
    const navigate = useNavigate();
    const isAuth: boolean = useAuth();

    const navigateToPage = (path: string): void => {navigate(path)};

    return (
        <>
            {isAuth
                ? protectedNavigation.map((el, index) =>
                    <Button
                        key={index}
                        onClick={() => navigateToPage(el.path)}
                        className={urlPath === el.path && cl.active}
                    >
                        {el.pageName || "Name not provided"}
                    </Button>
                )
                : publicNavigation.map((el, index) =>
                    <Button
                        key={index}
                        onClick={() => navigateToPage(el.path)}
                        className={urlPath === el.path && cl.active}
                    >
                        {el.pageName || "Name not provided"}
                    </Button>
                )
            }
        </>
    );
};

export default Navigation;