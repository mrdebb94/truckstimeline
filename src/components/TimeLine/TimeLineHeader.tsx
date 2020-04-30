import * as React from 'react';
import { useMemo } from 'react';
import { formatDate } from '../../utils/DateUtils';

import '../../../static/TimeLine.css';

export default function TimeLineHeader({ timeStepWidth, truckWidth, offsetX, offsetStepX, minDate }:
    { timeStepWidth: number; truckWidth: number; offsetX: number; offsetStepX: number; minDate: Date }): React.ReactElement {

    const timeStepNumber = useMemo(() => Math.ceil(100 / timeStepWidth), [timeStepWidth]);
    const fixDate = new Date(minDate.getTime() + offsetStepX * 4 * 60 * 60000);
    return (<div
        className={'timeLineHeader'}
        style={{
            marginLeft: `${truckWidth}%`
        }}
    >
        <div
            className={'timesContainer'}
            style={{
                marginLeft: `${-timeStepWidth + offsetX}%`,
                marginRight: `-${-timeStepWidth + offsetX}%`,
            }}
        >
            {[...Array(timeStepNumber + 1).keys()].map(index => {
                const increasedDate = new Date(fixDate.getTime());
                increasedDate.setHours(fixDate.getHours() + (index - 1) * 4);

                return (
                    <div
                        className={'time'}
                        style={{
                            minWidth: `${timeStepWidth}%`,
                            maxWidth: `${timeStepWidth}%`
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