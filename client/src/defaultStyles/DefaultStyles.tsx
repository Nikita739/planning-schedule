import React, {PropsWithChildren} from 'react';
import cl from './DefaultStyles.module.css';

const DefaultStyles = ({children}: PropsWithChildren) => {
    return (
        <div className={cl.outer}>
            {children}
        </div>
    );
};

export default DefaultStyles;