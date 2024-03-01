import React, {ChangeEvent, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useRegistrationMutation} from "../../features/auth/authApiSlice";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {setCredentials} from "../../features/auth/authSlice";
import {
    IFormValidationError,
    validateEmail,
    validatePassword,
    validateUsername
} from "../../features/formValidation/formValidation";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import cl from "../Login/Login.module.css";

const Registration = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [usernameError, setUsernameError] = useState<IFormValidationError>({result: true});
    const [emailError, setEmailError] = useState<IFormValidationError>({result: true});
    const [passwordError, setPasswordError] = useState<IFormValidationError>({result: true});
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [registration, {isLoading}] = useRegistrationMutation();
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        setErrorMessage("");
        setEmailError({result: true});
        setPasswordError({result: true});
        setUsernameError({result: true});
    }, [username, email, password]);

    const validate = (): boolean => {
        let res = true;

        const usernameValid = validateUsername(username);
        if(!usernameValid.result) {
            res = false;
            setUsernameError(usernameValid);
        }

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
                const registrationData = await registration({username, email, password}).unwrap();
                console.log(registrationData);
                dispatch(setCredentials({
                    user: registrationData.user,
                    accessToken: registrationData.accessToken,
                    settings: registrationData.settings || null
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

                    <div className={cl.inputPair}>
                        <Input
                            type="text"
                            placeholder="Enter your username"
                            onChange={handleUsernameInput}
                            value={username}
                        />
                        {!usernameError.result
                            &&
                                <p>{emailError.message || "Email incorrect"}</p>
                        }
                    </div>

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
                        Register
                    </Button>
                </div>
            }
        </div>
    );
};

export default Registration;