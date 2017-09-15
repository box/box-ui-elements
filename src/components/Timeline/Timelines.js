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
    skill: SkillData,
    getPreviewer?: Function
};

const Timelines = ({ skill: { entries, duration }, getPreviewer }: Props) => {
    const colors = randomcolor({ count: entries.length, luminosity: 'dark' });
    return (
        <div className='buik-timelines'>
            {entries.map(
                ({ type, text, url, appears }: SkillDataEntry, index) =>
                    /* eslint-disable react/no-array-index-key */
                    <Timeline
                        key={index}
                        type={type}
                        text={text}
                        url={url}
                        color={colors[index]}
                        timeslices={appears}
                        duration={duration}
                        getPreviewer={getPreviewer}
                    />
                /* eslint-enable react/no-array-index-key */
            )}
        </div>
    );
};

export default Timelines;
