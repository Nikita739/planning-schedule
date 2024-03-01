import React, {ChangeEvent, EventHandler, useEffect, useRef, useState} from 'react';
import cl from './Login.module.css';

import {useNavigate} from 'react-router-dom';

import {useDispatch} from "react-redux";
import {setCredentials} from "../../features/auth/authSlice";
import {useLoginMutation} from "../../features/auth/authApiSlice";
import {Dispatch} from "@reduxjs/toolkit";
import Input from "../../UI/Input/Input";
import {IFormValidationError, validateEmail, validatePassword} from "../../features/formValidation/formValidation";
import Button from "../../UI/Button/Button";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [emailError, setEmailError] = useState<IFormValidationError>({result: true});
    const [passwordError, setPasswordError] = useState<IFormValidationError>({result: true});
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [login, {isLoading}] = useLoginMutation();
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        setErrorMessage("");
        setEmailError({result: true});
        setPasswordError({result: true});
    }, [email, password]);

    const validate = (): boolean => {
        let res = true;

        const emailValid = validateEmail(email);
        if(!emailValid.result) {
            res = false;
            setEmailError(emailValid);
        }

        const passwordValid = validatePassword(password);
        if(!passwordValid.result) {
            res = false;
            setPasswordError(passwordValid);
        }

        return res;
    }

    const handleSubmit = async (): Promise<void> => {
        if(validate()) {
            try {
                const loginData = await login({email, password}).unwrap();
                console.log(loginData);
                dispatch(setCredentials({
                    user: loginData.user,
                    accessToken: loginData.accessToken,
                    settings: loginData.settings || null
                }));
                setEmail('');
                setPassword('');
                navigate('/');
            } catch (err: any) {
                if(!err) {
                    setErrorMessage("Server doesn't respond");
                } else if(err?.status === 400) {
                    setErrorMessage("Missing username or email");
                } else if(err?.status === 401) {
                    setErrorMessage("Unauthorized");
                } else {
                    setErrorMessage("Login failed");
                }
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

                    <div className={cl.inputPair}>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            onChange={handleEmailInput}
                            value={email}
                        />
                        {!emailError.result
                            &&
                                <p>{emailError.message || "Email incorrect"}</p>
                        }
                    </div>
                    <div className={cl.inputPair}>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            onChange={handlePasswordInput}
                            value={password}
                        />
                        {!passwordError.result
                            &&
                                <p>{passwordError.message || "Password incorrect"}</p>
                        }
                    </div>
                    <Button
                        onClick={handleSubmit}
                    >
                        Log in
                    </Button>
                </div>
            }
        </div>
    );
};

export default Login;