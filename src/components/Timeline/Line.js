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
    end?: number,
    getPreviewer?: Function
};

const LENGTH_IMAGE_ITEMLINE = 235;
const LENGTH_TEXT_ITEMLINE = 290;

const Line = ({ type, start, end = 0, duration, color = '#777', getPreviewer }: Props) => {
    if (typeof start !== 'number' || !duration) {
        return null;
    }
    const barLength = type === 'image' ? LENGTH_IMAGE_ITEMLINE : LENGTH_TEXT_ITEMLINE;
    const startPercent = Math.round(start * barLength / duration);
    const endPercent = Math.round(Math.max(startPercent + 9, end * barLength / duration));
    const styles = {
        backgroundColor: color,
        left: `${startPercent}px`,
        width: `${endPercent - startPercent}px`
    };
    const onClick = () => {
        const viewer = getPreviewer ? getPreviewer() : null;
        if (viewer && viewer.isLoaded() && !viewer.isDestroyed() && typeof viewer.play === 'function') {
            viewer.play(start);
        }
    };
    return <PlainButton className='buik-timeline-time' style={styles} onClick={onClick} />;
};

export default Line;
