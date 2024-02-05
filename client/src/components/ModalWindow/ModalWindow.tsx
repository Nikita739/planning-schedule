import React, {Dispatch, ReactChildren, ReactElement, SetStateAction} from 'react';
import cl from './ModalWindow.module.css';

interface Props {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    children: ReactElement
}

const ModalWindow = ({setIsOpen, children}: Props) => {
    const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();

        setIsOpen(false);
    }

    const contentClick = (e: React.MouseEvent<HTMLDivElement>) => {e.stopPropagation()}

    return (
        <div
            className={cl.outer}
            onClick={(e) => closeModal(e)}
        >
            <div onClick={contentClick} className={cl.content}>
                {children}
            </div>
        </div>
    );
};

export default ModalWindow;