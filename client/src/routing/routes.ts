import {FC} from "react";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Welcome from "../pages/Welcome/Welcome";
import Logout from "../features/auth/Logout";
import Registration from "../pages/Registration/Registration";
import EventTable from "../pages/EventTable/EventTable";

interface IRoute {
    path: string,
    element: FC,
    pageName?: string
}

export const publicRoutes: IRoute[] = [
    {path: '/', element: Home, pageName: "Home"},
    {path: '/login', element: Login, pageName: "Login"},
    {path: '/registration', element: Registration, pageName: "Register"},
];

export const protectedRoutes: IRoute[] = [
    {path: '/', element: Home, pageName: "Home"},
    {path: '/welcome', element: Welcome, pageName: "Welcome"},
    {path: '/logout', element: Logout, pageName: "Logout"},
    {path: '/event-table', element: EventTable, pageName: "Event Table"},
];

export const publicNavigation: IRoute[] = [
    {path: '/login', element: Login, pageName: "Login"},
    {path: '/registration', element: Registration, pageName: "Register"},
];

export const protectedNavigation: IRoute[] = [
    {path: '/welcome', element: Welcome, pageName: "Welcome"},
    {path: '/logout', element: Logout, pageName: "Logout"},
];