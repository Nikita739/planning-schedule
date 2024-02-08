import React from 'react';
import cl from './Textarea.module.css';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {

}

const Textarea = ({...props}: Props) => {
    return (
        <textarea
            {...props}
            rows={props.rows || 5}
            className={[cl.textarea, props.className].join(" ")}
        >

        </textarea>
    );
};

export default Textarea;