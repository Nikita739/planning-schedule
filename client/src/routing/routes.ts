import {FC} from "react";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Welcome from "../pages/Welcome/Welcome";
import Logout from "../features/auth/Logout";
import Registration from "../pages/Registration/Registration";

interface IRoute {
    path: string,
    element: FC
}

export const publicRoutes: IRoute[] = [
    {path: '/', element: Home},
    {path: '/login', element: Login},
    {path: '/registration', element: Registration},
];

export const protectedRoutes: IRoute[] = [
    {path: '/welcome', element: Welcome},
    {path: '/logout', element: Logout},
];