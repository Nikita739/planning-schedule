import React, {ReactNode} from 'react';
import cl from './Button.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Button = ({children, onClick, ...props}: Props) => {
    return (
        <button
            className={[cl.button, props.className || ""].join(" ")}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;