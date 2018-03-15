/**
 * @flow
 * @file Timelines component
 * @author Box
 */

import React from 'react';
import randomcolor from 'randomcolor';
import Timeline from './Timeline';
import type { SkillCard, SkillCardEntry } from '../../../../flowTypes';

type Props = {
    skill: SkillCard,
    onInteraction: Function,
    getPreviewer?: Function
};

const Timelines = ({ skill: { entries, duration }, getPreviewer, onInteraction }: Props) => {
    const colors = randomcolor({ count: entries.length, luminosity: 'dark' });
    return (
        <div className='be-timelines'>
            {entries.map(
                ({ type, text, image_url, appears }: SkillCardEntry, index) => (
                    /* eslint-disable react/no-array-index-key */
                    <Timeline
                        key={index}
                        type={type}
                        text={text}
                        url={image_url}
                        color={colors[index]}
                        timeslices={appears}
                        duration={duration}
                        getPreviewer={getPreviewer}
                        onInteraction={onInteraction}
                    />
                )
                /* eslint-enable react/no-array-index-key */
            )}
        </div>
    );
};

export default Timelines;
