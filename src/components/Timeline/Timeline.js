/**
 * @flow
 * @file Timeline component
 * @author Box
 */

import React from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
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

const Timeline = ({
    type = 'text',
    color,
    text = '',
    url = '',
    duration = 0,
    timeslices = [],
    getPreviewer
}: Props) => {
    let nextTimeSliceIndex = 0;
    const startNextSegment = () => {
        const viewer = getPreviewer ? getPreviewer() : null;
        if (
            viewer &&
            viewer.isLoaded() &&
            !viewer.isDestroyed() &&
            typeof viewer.play === 'function' &&
            timeslices[nextTimeSliceIndex]
        ) {
            viewer.play(timeslices[nextTimeSliceIndex].start);
            nextTimeSliceIndex = (nextTimeSliceIndex + 1) % timeslices.length;
        }
    };

    return (
        <div className={`be-timeline be-timeline-${type}`}>
            {(text || url) && (
                <div className='be-timeline-label'>
                    {type === 'image' ? (
                        <PlainButton type='button' onClick={startNextSegment}>
                            <div className='be-timeline-image-container'>
                                <img alt={text} title={text} src={url} />
                            </div>
                        </PlainButton>
                    ) : (
                        <span>{text}</span>
                    )}
                </div>
            )}
            <div className='be-timeline-wrapper'>
                <div className='be-timeline-line' style={{ backgroundColor: color }} />
                {timeslices.map(
                    ({ start, end }: TimeSlice, index) => (
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
                    )
                    /* eslint-enable react/no-array-index-key */
                )}
            </div>
        </div>
    );
};

export default Timeline;
