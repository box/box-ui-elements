/**
 * @flow
 * @file Timelines component
 * @author Box
 */

import React from 'react';
import randomcolor from 'randomcolor';
import Timeline from './Timeline';
import type { SkillData, SkillDataEntry } from '../../flowTypes';

type Props = {
    skill: SkillData
};

const Timelines = ({ skill: { entries, duration } }: Props) => {
    const colors = randomcolor({ count: entries.length, luminosity: 'dark' });
    return (
        <div className='buik-timelines'>
            {entries.map(
                ({ entry_type, text, url, appears }: SkillDataEntry, index) =>
                    /* eslint-disable react/no-array-index-key */
                    <Timeline
                        key={index}
                        type={entry_type}
                        text={text}
                        url={url}
                        color={colors[index]}
                        timeslices={appears}
                        duration={duration}
                    />
                /* eslint-enable react/no-array-index-key */
            )}
        </div>
    );
};

export default Timelines;
