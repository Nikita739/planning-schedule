import React, {useEffect} from 'react';
import Router from "./routing/Router";
import DefaultStyles from "./defaultStyles/DefaultStyles";
import {IUser, setCredentials} from "./features/auth/authSlice";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";

function App() {
    const dispatch: Dispatch = useDispatch();

    // At the start, check if the userData is in the localStorage
    useEffect(() => {
        const user: IUser | null = JSON.parse(localStorage.getItem('user') as string);
        const accessToken: string | null = localStorage.getItem('accessToken') as string;
        console.log(user);
        if(user) {
            dispatch(setCredentials({user: user, accessToken: accessToken}));
        }
    }, []);

    return (
        <DefaultStyles>
            <h1>HEADER</h1>
            <Router />
            <h1>FOOTER</h1>
        </DefaultStyles>
    );
}

export default App;
