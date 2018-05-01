/**
 * @flow
 * @file Timeline line component
 * @author Box
 */

import React from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import { COLOR_BOX_BLUE } from '../../../../constants';
import type { SkillCardEntryType } from '../../../../flowTypes';
import './Line.scss';

type Props = {
    type: SkillCardEntryType,
    start: number,
    duration: number,
    color?: string,
    end?: number,
    getPreviewer?: Function,
    onInteraction: Function
};

const LENGTH_IMAGE_ITEMLINE = 215;
const LENGTH_TEXT_ITEMLINE = 270;

const Line = ({ type, start, end = 0, duration, color = COLOR_BOX_BLUE, getPreviewer, onInteraction }: Props) => {
    if (typeof start !== 'number' || !duration) {
        return null;
    }
    const barLength = type === 'image' ? LENGTH_IMAGE_ITEMLINE : LENGTH_TEXT_ITEMLINE;
    const startLeft = Math.round(start * barLength / duration);
    const endLeft = Math.round(Math.min(barLength, Math.max(startLeft + 6, end * barLength / duration)));
    const styles = {
        backgroundColor: color,
        left: `${startLeft}px`,
        width: `${endLeft - startLeft}px`
    };
    const onClick = () => {
        const viewer = getPreviewer ? getPreviewer() : null;
        onInteraction({ target: 'time-slice' });
        if (viewer && viewer.isLoaded() && !viewer.isDestroyed() && typeof viewer.play === 'function') {
            viewer.play(start);
        }
    };
    return <PlainButton type='button' className='be-timeline-time' style={styles} onClick={onClick} />;
};

export default Line;
