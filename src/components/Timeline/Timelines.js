/**
 * @flow
 * @file Timelines component
 * @author Box
 */

import React from 'react';
import randomcolor from 'randomcolor';
import Timeline from './Timeline';
import type { Card, CardEntry } from '../../flowTypes';

type Props = {
    card: Card
};

const Timelines = ({ card: { entries, duration } }: Props) => {
    const colors = randomcolor({ count: entries.length, luminosity: 'dark' });
    return (
        <div className='buik-timelines'>
            {entries.map(({ id, type, text, url, appears }: CardEntry, index) =>
                <Timeline
                    key={id}
                    type={type}
                    text={text}
                    url={url}
                    color={colors[index]}
                    timeslices={appears}
                    duration={duration}
                />
            )}
        </div>
    );
};

export default Timelines;
