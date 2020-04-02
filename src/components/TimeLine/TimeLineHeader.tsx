import * as React from 'react';
import { ITrucksTimeLineProps } from './TimeLine';
import { useMemo } from 'react';

function formatDate(date: Date) {
    return `${addLeadingZeros(date.getMonth() + 1)}.${addLeadingZeros(date.getDate())} 
    ${addLeadingZeros(date.getHours())} ${addLeadingZeros(date.getMinutes())}`;
}

function addLeadingZeros(value: number) {
    return ('0' + value).slice(-2);
}

export default function TimeLineHeader({timeStepWidth, truckWidth, offsetX, offsetStepX, minDate}:any) {
    const timeStepNumber = useMemo(() => Math.ceil(100 / timeStepWidth), [timeStepWidth]);
    
    return (<div
        id={'timesContainer'}
        style={{
            marginLeft: `${truckWidth}%`,
            display: 'flex',
            overflowX: 'hidden',
            flexShrink: 0,
        }}
    >
        <div
            style={{
                marginLeft: `${-timeStepWidth + offsetX}%`,
                marginRight: `-${-timeStepWidth + offsetX}%`,
                width: '100%',
                display: 'flex',
            }}
        >
            {[...Array(timeStepNumber + 1).keys()].map(index => {
                let fixDate = new Date(minDate.getTime() + -offsetStepX * 4 * 60 * 60000);
                let increasedDate = new Date(fixDate.getTime());
                let unit = timeStepWidth / (4 * 60);

                increasedDate.setHours(fixDate.getHours() + (index - 1) * 4);
                return (
                    <div
                        style={{
                            display: 'flex',
                            minWidth: `${timeStepWidth}%`,
                            maxWidth: `${timeStepWidth}%`,
                            whiteSpace: 'nowrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        key={index}
                    >
                        {formatDate(increasedDate)}
                    </div>
                );
            })}
        </div>
    </div>);
}