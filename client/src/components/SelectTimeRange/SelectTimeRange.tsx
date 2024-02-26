import React, {useEffect, useState} from 'react';
import SelectTime, {TimeBoundaries} from "../SelectTime/SelectTime";
import cl from './SelectTimeRange.module.css'

interface Props {
    initialStartTime?: number;
    initialEndTime?: number;
    setStartTime: React.Dispatch<React.SetStateAction<number>>;
    setEndTime: React.Dispatch<React.SetStateAction<number>>;
    startTime: number;
    endTime: number;
    min?: number
}

const SelectTimeRange = ({initialEndTime, initialStartTime, setEndTime, setStartTime, startTime, endTime, min}: Props) => {
    const [startTimeBoundaries, setStartTimeBoundaries] = useState<TimeBoundaries>({
        min: min || 1
    });

    const [endTimeBoundaries, setEndTimeBoundaries] = useState<TimeBoundaries>({
        min: startTime + 1
    });

    useEffect(() => {
        setEndTimeBoundaries({
            max: endTimeBoundaries?.max,
            min: startTime + 1,
        });
    }, [startTime]);

    const onStartTimeChange = (num: number) => {
        setStartTime(num);
        if(num >= endTime) {
            console.log("HERE!!!")
            setEndTime(num + 1);
        }
    }

    const onEndTimeChange = (num: number) => {
        setEndTime(num);
    }

    return (
        <div>
            <p>Start time:</p>
            <SelectTime
                onChange={onStartTimeChange}
                className={cl.timeSelect}
                value={startTime}
                boundaries={startTimeBoundaries}
            />

            <p>End time:</p>
            <SelectTime
                onChange={onEndTimeChange}
                className={cl.timeSelect}
                value={endTime}
                boundaries={endTimeBoundaries}
            />
        </div>
    );
};

export default SelectTimeRange;