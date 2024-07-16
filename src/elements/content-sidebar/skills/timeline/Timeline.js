/**
 * @flow
 * @file Timeline component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../components/plain-button/PlainButton';
import IconTrackNext from '../../../../icons/general/IconTrackNext';
import IconTrackPrevious from '../../../../icons/general/IconTrackPrevious';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import Timeslice from './Timeslice';
import { isValidStartTime } from '../transcript/timeSliceUtils';
import type { SkillCardEntryTimeSlice, SkillCardEntryType } from '../../../../common/types/skills';

import './Timeline.scss';

type Props = {
    duration?: number,
    getViewer?: Function,
    interactionTarget: string,
    text?: string,
    timeslices?: SkillCardEntryTimeSlice[],
    type?: SkillCardEntryType,
    url?: string,
};

const Timeline = ({ text = '', duration = 0, timeslices = [], getViewer, interactionTarget }: Props) => {
    let timeSliceIndex = -1;

    const playSegment = (index: number, incr: number = 0) => {
        const newIndex = incr > 0 ? Math.min(timeslices.length - 1, index + incr) : Math.max(0, index + incr);
        const viewer = getViewer ? getViewer() : null;
        const timeslice = timeslices[newIndex];
        const validTime = isValidStartTime(timeslice);

        if (validTime && viewer && typeof viewer.play === 'function') {
            viewer.play(timeslice.start);
            timeSliceIndex = newIndex;
        }
    };

    return (
        <div className="be-timeline">
            {text && <div className="be-timeline-label">{text}</div>}
            <div className="be-timeline-line-wrapper">
                <div className="be-timeline-line" />
                {timeslices.map(
                    ({ start, end }: SkillCardEntryTimeSlice, index) => (
                        /* eslint-disable react/no-array-index-key */
                        <Timeslice
                            key={index}
                            duration={duration}
                            end={end}
                            index={index}
                            interactionTarget={interactionTarget}
                            onClick={playSegment}
                            start={start}
                        />
                    ),
                    /* eslint-enable react/no-array-index-key */
                )}
            </div>
            <div className="be-timeline-btns">
                <PlainButton
                    data-resin-target={SKILLS_TARGETS.TIMELINE.PREVIOUS}
                    onClick={() => playSegment(timeSliceIndex, -1)}
                    type="button"
                >
                    <IconTrackPrevious title={<FormattedMessage {...messages.previousSegment} />} />
                </PlainButton>
                <PlainButton
                    data-resin-target={SKILLS_TARGETS.TIMELINE.NEXT}
                    onClick={() => playSegment(timeSliceIndex, 1)}
                    type="button"
                >
                    <IconTrackNext title={<FormattedMessage {...messages.nextSegment} />} />
                </PlainButton>
            </div>
        </div>
    );
};

export default Timeline;
