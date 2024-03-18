import React, {SetStateAction, useState} from 'react';
import {useDispatch} from "react-redux";
import {changeSettings, ISettings, selectSettings} from "../../features/auth/authSlice";
import {useChangeColorSettingsMutation} from "../../features/auth/authApiSlice";
import {store} from "../../app/store";
import SelectColor from "../SelectColor/SelectColor";
import cl from './SelectPriorityColors.module.css';

const priorityColors: string[] = [
    "#2cff00",
    "#fffe00",
    "#ff0000",
    "#00e4ff",
    "#bb00ff",
    "#ff5d00",
];

const SelectPriorityColors = ({onChange}: {onChange?: () => any}) => {
    const [changeColorSettings] = useChangeColorSettingsMutation();
    const dispatch = useDispatch();
    const settings: ISettings | null = selectSettings(store.getState());

    const [colors, setColors] = useState<string[]>(settings?.priorityColors || ["#2cff00", "#fffe00", "#ff0000"]);
    const [colorError, setColorError] = useState<string | null>(null);

    const changeColor = (i: number, color: string) => {
        const newColors = [...colors];
        newColors[i] = color;
        setColors(newColors);

        submitNewColors(newColors).then();
    }

    const submitNewColors = async (newColors: string[]) => {
        try {
            const res = await changeColorSettings({newColors: newColors}).unwrap();

            dispatch(changeSettings({priorityColors: res.priorityColors}));
            onChange && onChange();
        } catch (err: any) {
            console.log(err);
            setColorError("Something went wrong...");
        }
    }

    const onLowChange = (color: string) => {changeColor(0, color)}
    const onMediumChange = (color: string) => {changeColor(1, color)}
    const onHighChange = (color: string) => {changeColor(2, color)}

    const calculateAvailableColors = (): string[] => {
        const newColors = [...priorityColors];

        // Remove selected colors out of the select options
        for(let i = 0; i < 3; i++) {
            const index = newColors.indexOf(colors[i]);
            if (index > -1) { // only splice array when item is found
                newColors.splice(index, 1); // 2nd parameter means remove one item only
            }
        }

        return newColors;
    }

    return (
        <div className={cl.outer}>
            <h2 className={cl.heading}>Select priority colors:</h2>
            {colorError
                && <p>{colorError}</p>
            }

            <div className={cl.colorsContainer}>
                <div className={cl.selectColorPair}>
                    <p>Low:</p>
                    <SelectColor
                        color={colors[0]}
                        colors={calculateAvailableColors()}
                        onChange={onLowChange}
                    />
                </div>
                <div className={cl.selectColorPair}>
                    <p>Medium:</p>
                    <SelectColor
                        color={colors[1]}
                        colors={calculateAvailableColors()}
                        onChange={onMediumChange}
                    />
                </div>
                <div className={cl.selectColorPair}>
                    <p>High:</p>
                    <SelectColor
                        color={colors[2]}
                        colors={calculateAvailableColors()}
                        onChange={onHighChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default SelectPriorityColors;