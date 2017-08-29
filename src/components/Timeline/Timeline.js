/**
 * @flow
 * @file Timeline component
 * @author Box
 */

import React from 'react';
import Line from './Line';
import type { TimeSlice, CardEntryType } from '../../flowTypes';
import './Timeline.scss';

type Props = {
    type: CardEntryType,
    text?: string,
    url?: string,
    timeslices?: TimeSlice[],
    duration?: number
};

const Timeline = ({ type, text = '', url = '', duration = 0, timeslices = [] }: Props) =>
    <div className={`buik-timeline buik-timeline-${type}`}>
        {(text || url) &&
            <div className='buik-timeline-label'>
                {type === 'image'
                    ? <img alt={text} src={url} />
                    : <span>
                        {text}
                    </span>}
            </div>}
        <div className='buik-timeline-wrapper'>
            <div className='buik-timeline-line' />
            {timeslices.map(({ id: timeId, start, end }: TimeSlice) =>
                <Line key={timeId} type={type} start={start} end={end} duration={duration} />
            )}
        </div>
    </div>;

export default Timeline;
