import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Calendar from "../../features/calendar/Calendar";

const Home = () => {
    const navigate = useNavigate();

    const logout = (): void => {
        navigate('/logout');
    }

    return (
        <div>
            <Calendar />
        </div>
    );
};

export default Home;