import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useRegistrationMutation} from "../../features/auth/authApiSlice";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {setCredentials} from "../../features/auth/authSlice";

const Registration = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [registration, {isLoading}] = useRegistrationMutation();
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        setErrorMessage("");
    }, [username, email, password]);

    const handleSubmit = async (): Promise<void> => {
        try {
            const registrationData = await registration({username, email, password}).unwrap();
            console.log(registrationData);
            dispatch(setCredentials({
                user: registrationData.user,
                accessToken: registrationData.accessToken
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

    const handleUsernameInput = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
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

                    <h1>Registration</h1>

                    <input
                        type="text"
                        placeholder="Enter your username"
                        onChange={handleUsernameInput}
                        value={username}
                    />
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
                        Register
                    </button>
                </div>
            }
        </div>
    );
};

export default Registration;