import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const logout = (): void => {
        navigate('/logout');
    }

    return (
        <div>
            <Link
                to='/login'
            >
                Login
            </Link>
            <Link to={'/welcome'}>
                Welcome
            </Link>
            <button
                onClick={logout}
            >
                Log out
            </button>
        </div>
    );
};

export default Home;