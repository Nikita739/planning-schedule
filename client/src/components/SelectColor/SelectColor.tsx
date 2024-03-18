import React, {useEffect, useState} from 'react';
import cl from './SelectColor.module.css';
import {log} from "util";

interface Props {
    color: string,
    colors: string[],
    onChange: (color: string) => any
}

const SelectColor = ({colors, onChange, color}: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const addClickEventListener = () => {
        const body = document.getElementById('id-body');
        if(!body) return;

        body.addEventListener('click', () => {
            setIsOpen(false);
        });
    }

    useEffect(() => {
        addClickEventListener();
    }, []);

    const handleColorChange = (newColor: string): void => {
        setIsOpen(false);
        onChange(newColor);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    const handleOpenModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(true);
    }

    return (
        <div
            className={cl.colorSquare}
            style={{backgroundColor: color}}
            onClick={(e) => handleOpenModal(e)}
        >
            {isOpen
                &&
                <div
                    className={cl.popup}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={cl.selectOptions}>
                        <p style={{padding: 0, margin: 0}}>Select color:</p>
                        <div
                            className={cl.closeButtonHover}
                            onClick={handleCloseModal}
                        >
                            <span
                                className={cl.closeButton}
                            >
                                ╳
                            </span>
                        </div>
                    </div>
                    <div className={cl.selectColorsContainer}>
                        {colors.map(el =>
                            <div
                                className={[cl.colorSquare, cl.selectColorSquare].join(" ")}
                                style={{backgroundColor: el}}
                                onClick={() => handleColorChange(el)}
                            >
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default SelectColor;