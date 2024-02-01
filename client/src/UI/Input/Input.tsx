import React, {HTMLInputTypeAttribute} from 'react';
import cl from './Input.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {

}

const Input = ({...props}: Props) => {
    return (
        <input
            {...props}
            className={[cl.input, props.className].join(" ")}
        />
    );
};

export default Input;