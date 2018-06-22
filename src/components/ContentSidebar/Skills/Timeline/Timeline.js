/**
 * @flow
 * @file Timeline component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconTrackNext from 'box-react-ui/lib/icons/general/IconTrackNext';
import IconTrackPrevious from 'box-react-ui/lib/icons/general/IconTrackPrevious';
import Timeslice from './Timeslice';
import { isValidStartTime } from '../Transcript/timeSliceUtils';
import messages from '../../../messages';

import './Timeline.scss';

type Props = {
    type?: SkillCardEntryType,
    text?: string,
    url?: string,
    timeslices?: SkillCardEntryTimeSlice[],
    duration?: number,
    getPreviewer?: Function,
    interactionTarget: string
};

const Timeline = ({ text = '', duration = 0, timeslices = [], getPreviewer, interactionTarget }: Props) => {
    let timeSliceIndex = -1;

    const playSegment = (index: number, incr: number = 0) => {
        const newIndex = incr > 0 ? Math.min(timeslices.length - 1, index + incr) : Math.max(0, index + incr);
        const viewer = getPreviewer ? getPreviewer() : null;
        const timeslice = timeslices[newIndex];
        const validTime = isValidStartTime(timeslice);

        if (validTime && viewer && viewer.isLoaded() && !viewer.isDestroyed() && typeof viewer.play === 'function') {
            viewer.play(timeslice.start);
            timeSliceIndex = newIndex;
        }
    };

    return (
        <div className='be-timeline'>
            {text && <div className='be-timeline-label'>{text}</div>}
            <div className='be-timeline-line-wrapper'>
                <div className='be-timeline-line' />
                {timeslices.map(
                    ({ start, end }: SkillCardEntryTimeSlice, index) => (
                        /* eslint-disable react/no-array-index-key */
                        <Timeslice
                            key={index}
                            index={index}
                            start={start}
                            end={end}
                            duration={duration}
                            onClick={playSegment}
                            interactionTarget={interactionTarget}
                        />
                    )
                    /* eslint-enable react/no-array-index-key */
                )}
            </div>
            <div className='be-timeline-btns'>
                <PlainButton type='button' onClick={() => playSegment(timeSliceIndex, -1)}>
                    <IconTrackPrevious title={<FormattedMessage {...messages.previousSegment} />} />
                </PlainButton>
                <PlainButton type='button' onClick={() => playSegment(timeSliceIndex, 1)}>
                    <IconTrackNext title={<FormattedMessage {...messages.nextSegment} />} />
                </PlainButton>
            </div>
        </div>
    );
};

export default Timeline;
