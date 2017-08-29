/**
 * @flow
 * @file Timeline line component
 * @author Box
 */

import React from 'react';
import { PlainButton } from '../Button';
import type { CardEntryType } from '../../flowTypes';
import './Line.scss';

type Props = {
    type: CardEntryType,
    start: number,
    duration: number,
    end?: number
};

const LENGTH_IMAGE_ITEMLINE = 220;
const LENGTH_TEXT_ITEMLINE = 260;

const Line = ({ type, start, end, duration }: Props) => {
    if (typeof start !== 'number' || !end || !duration) {
        return null;
    }
    const startPercent = start * 100 / duration;
    const endPercent = end * 100 / duration;
    const styles = {
        left: `${startPercent}%`,
        width: `${(endPercent - startPercent) *
            (type === 'image' ? LENGTH_IMAGE_ITEMLINE : LENGTH_TEXT_ITEMLINE) /
            100}px`
    };
    return <PlainButton className='buik-timeline-time' style={styles} />;
};

export default Line;
