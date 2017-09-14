/**
 * @flow
 * @file Timeline line component
 * @author Box
 */

import React from 'react';
import { PlainButton } from '../Button';
import type { SkillDataEntryType } from '../../flowTypes';
import './Line.scss';

type Props = {
    type: SkillDataEntryType,
    start: number,
    duration: number,
    color?: string,
    end?: number
};

const LENGTH_IMAGE_ITEMLINE = 250;
const LENGTH_TEXT_ITEMLINE = 290;

const Line = ({ type, start, end = 0, duration, color = '#777' }: Props) => {
    if (typeof start !== 'number' || !duration) {
        return null;
    }
    const barLength = type === 'image' ? LENGTH_IMAGE_ITEMLINE : LENGTH_TEXT_ITEMLINE;
    const startPercent = start * barLength / duration;
    const endPercent = Math.max(startPercent + 5, end * barLength / duration);
    const styles = {
        backgroundColor: color,
        left: `${startPercent}px`,
        width: `${endPercent - startPercent}px`
    };
    return <PlainButton className='buik-timeline-time' style={styles} />;
};

export default Line;
