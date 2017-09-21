/**
 * @flow
 * @file Timeline component
 * @author Box
 */

import React from 'react';
import Line from './Line';
import type { TimeSlice, SkillDataEntryType } from '../../flowTypes';
import './Timeline.scss';

type Props = {
    type?: SkillDataEntryType,
    color?: string,
    text?: string,
    url?: string,
    timeslices?: TimeSlice[],
    duration?: number,
    getPreviewer?: Function
};

const Timeline = ({ type = 'text', color, text = '', url = '', duration = 0, timeslices = [], getPreviewer }: Props) =>
    <div className={`buik-timeline buik-timeline-${type}`}>
        {(text || url) &&
            <div className='buik-timeline-label'>
                {type === 'image'
                    ? <img alt={text} title={text} src={url} />
                    : <span>
                        {text}
                    </span>}
            </div>}
        <div className='buik-timeline-wrapper'>
            <div className='buik-timeline-line' />
            {timeslices.map(
                ({ start, end }: TimeSlice, index) =>
                    /* eslint-disable react/no-array-index-key */
                    <Line
                        key={index}
                        color={color}
                        type={type}
                        start={start}
                        end={end}
                        duration={duration}
                        getPreviewer={getPreviewer}
                    />
                /* eslint-enable react/no-array-index-key */
            )}
        </div>
    </div>;

export default Timeline;
