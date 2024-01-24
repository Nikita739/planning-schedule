import React, {ChangeEvent, EventHandler, useEffect, useRef, useState} from 'react';
import cl from './Login.module.css';

import {useNavigate} from 'react-router-dom';

import {useDispatch} from "react-redux";
import {setCredentials} from "../../features/auth/authSlice";
import {useLoginMutation} from "../../features/auth/authApiSlice";
import {Dispatch} from "@reduxjs/toolkit";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [login, {isLoading}] = useLoginMutation();
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        setErrorMessage("");
    }, [email, password]);

    const handleSubmit = async (): Promise<void> => {
        try {
            const loginData = await login({email, password}).unwrap();
            console.log(loginData);
            dispatch(setCredentials({
                user: loginData.user,
                accessToken: loginData.accessToken
            }));
            setEmail('');
            setPassword('');
            navigate('/');
        } catch (err: any) {
            if(!err?.response) {
                setErrorMessage("Server doesn't respond");
            } else if(err.response?.status === 400) {
                setErrorMessage("Missing username or email");
            } else if(err.response?.status === 401) {
                setErrorMessage("Unauthorized");
            } else {
                setErrorMessage("Login failed");
            }
        }
    }

    const handleEmailInput = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    return (
        <div>
            {isLoading
                ?
                    <h2>Loading...</h2>
                :
                <div>
                    {errorMessage !== ""
                        && <p>{errorMessage}</p>
                    }

                    <h1>Login</h1>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        onChange={handleEmailInput}
                        value={email}
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={handlePasswordInput}
                        value={password}
                    />
                    <button
                        onClick={handleSubmit}
                    >
                        Log in
                    </button>
                </div>
            }
        </div>
    );
};

export default Login;