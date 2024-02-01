import React from 'react';
import {Routes, Route} from "react-router-dom";
import {publicRoutes, protectedRoutes} from "./routes";
import useAuth from "../hooks/useAuth";
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import Login from "../pages/Login/Login";

const Router = () => {
    const isAuth: boolean = useAuth();

    return (
        <Routes>
            {isAuth
                ?
                    // Protected routes
                    protectedRoutes.map((el, index) =>
                        <Route key={index} element={<el.element />} path={el.path} />
                    )
                :
                    // Public routes
                    publicRoutes.map((el, index: number) =>
                        <Route key={index} element={<el.element />} path={el.path} />
                    )
            }

            <Route path="*" element={isAuth ? <PageNotFound /> : <Login />} />
        </Routes>
    );
};

export default Router;