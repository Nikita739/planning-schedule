import React, { useState, useEffect } from 'react';
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../features/auth/authSlice";
import {useLocation} from "react-router-dom";

function useAuth() {
    const token = useSelector(selectCurrentToken);
    const location = useLocation();

    console.log(token);

    return Boolean(token);
}

export default useAuth;