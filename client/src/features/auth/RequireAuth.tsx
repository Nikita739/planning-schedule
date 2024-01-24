import {useLocation, Navigate} from 'react-router-dom';
import {useSelector} from "react-redux";
import {selectCurrentToken} from "./authSlice";
import {PropsWithChildren} from "react";

const RequireAuth = ({children}: PropsWithChildren) => {
    const token = useSelector(selectCurrentToken);
    const location = useLocation();

    console.log(token);

    return (
        <div>
            {
                token
                    ? children
                    : <Navigate to="/login" state={{from: location}} replace />
            }
        </div>

    );
};

export default RequireAuth;