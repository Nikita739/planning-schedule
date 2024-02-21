import React, {ChangeEventHandler, useState} from 'react';
import cl from './SelectTime.module.css';

interface Props {
    boundaries?: TimeBoundaries;
    onChange: (num: number) => any;
    value?: number;
    className?: string;
}

export interface TimeBoundaries {
    min?: number;
    max?: number;
}

const SelectTime = ({boundaries, onChange, className, value}: Props) => {
    // const [time, setTime] = useState<number>(value || 1);

    const onValueChange = (num: number) => {
        // setTime(num);
        onChange(num);
    }

    const calculateSelectValues = (): number[] => {
        const res: number[] = [];

        for(let i: number = boundaries?.min || 1; i <= (boundaries?.max || 24); i++) {
            res.push(i);
        }

        return res;
    }

    return (
        <select
            className={[cl.select, className].join(" ")}
            onChange={(e) => onValueChange(Number(e.target.value))}
            value={value}
        >
            {calculateSelectValues().map(el =>
                <option value={el} key={el}>{el}:00</option>
            )}
        </select>
    );
};

export default SelectTime;