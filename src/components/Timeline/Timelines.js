/**
 * @flow
 * @file Timelines component
 * @author Box
 */

import React from 'react';
import Timeline from './Timeline';
import type { Card, CardEntry } from '../../flowTypes';

type Props = {
    card: Card
};

const Timelines = ({ card: { entries, duration } }: Props) =>
    <div className='buik-timelines'>
        {entries.map(({ id, type, text, url, appears }: CardEntry) =>
            <Timeline key={id} type={type} text={text} url={url} timeslices={appears} duration={duration} />
        )}
    </div>;

export default Timelines;
