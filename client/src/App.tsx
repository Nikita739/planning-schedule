import React, {useEffect} from 'react';
import Router from "./routing/Router";
import DefaultStyles from "./defaultStyles/DefaultStyles";
import {IUser, setCredentials} from "./features/auth/authSlice";
import {connect} from "./features/eventSocket/eventSocketSlice";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import './App.css';

function App() {
    const dispatch: Dispatch = useDispatch();

    // At the start, check if the userData is in the localStorage
    useEffect(() => {
        const user: IUser | null = JSON.parse(localStorage.getItem('user') as string);
        const accessToken: string | null = localStorage.getItem('accessToken') as string;

        if(user) {
            dispatch(setCredentials({user: user, accessToken: accessToken}));
        } else {
            return;
        }

        const eventSocket = new WebSocket("ws://localhost:4040");

        eventSocket.onopen = () => {
            console.log("CONNECTED TO THE EVENTS BROADCAST");
        };

        eventSocket.onmessage = (ev) => {
            console.log(ev.data);
        }
        setTimeout(() => {
            const loginEventData = {
                id: user.id
            }
            eventSocket.send(JSON.stringify(loginEventData));
        }, 50);

        dispatch(connect({socket: eventSocket}));
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DefaultStyles>
                <Header />
                <div className="app-main-content">
                    <Router />
                </div>
                <Footer />
            </DefaultStyles>
        </LocalizationProvider>
    );
}

export default App;
