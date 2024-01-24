import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {logOut} from "./authSlice";
import {Dispatch} from "@reduxjs/toolkit";
import {useNavigate} from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        dispatch(logOut());
        navigate('/');
    }, [])

    return (
        <h1>Logging out...</h1>
    );
};

export default Logout;