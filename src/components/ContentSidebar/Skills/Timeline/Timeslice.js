/**
 * @flow
 * @file Timeline line component
 * @author Box
 */

import React from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import { COLOR_BOX_BLUE } from '../../../../constants';
import './Timeslice.scss';

type Props = {
    start: number,
    duration: number,
    color?: string,
    end?: number,
    index: number,
    onClick: Function,
    interactionTarget: string
};

const LENGTH_TEXT_ITEMLINE = 290; // match with css

const Timeslice = ({ start, end, duration, color = COLOR_BOX_BLUE, onClick, index, interactionTarget }: Props) => {
    if (typeof start !== 'number' || !duration || start >= duration) {
        return null;
    }
    const barLength = LENGTH_TEXT_ITEMLINE;
    const startLeft = Math.round(start * barLength / duration);
    const minEnding = startLeft + 6; // Need at least some width to be clickable
    const ending = typeof end === 'number' ? Math.max(minEnding, end * barLength / duration) : minEnding;
    const endLeft = Math.round(Math.min(barLength, ending));
    const styles = {
        backgroundColor: color,
        left: `${startLeft}px`,
        width: `${endLeft - startLeft}px`
    };
    return (
        <PlainButton
            type='button'
            className='be-timeline-time'
            style={styles}
            onClick={() => onClick(index)}
            data-resin-target={interactionTarget}
        />
    );
};

export default Timeslice;
