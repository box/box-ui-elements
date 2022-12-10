import React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { Direction } from '../types';

import './Bar.scss';

const DEFAULT_SIZE = 50;

interface Props {
    color?: string;
    direction?: Direction;
    label?: string;
    onMouseEnter?: (arg1: { left: number; top: number }) => void;
    onMouseLeave?: () => void;
    size: number;
}

function Bar({
    color,
    direction = 'vertical',
    onMouseEnter = noop,
    onMouseLeave = noop,
    label,
    size = DEFAULT_SIZE,
}: Props) {
    const isHorizontal = direction === 'horizontal';
    const cssProperty = direction === 'horizontal' ? 'width' : 'height';
    const [style, setStyle] = React.useState({
        backgroundColor: color,
        [cssProperty]: '0%',
    });

    const adjustedSize = Math.max(0, size);
    const barRef = React.useRef<HTMLDivElement | null>(null);

    const handleMouseEnter = React.useCallback(() => {
        const offsetPosition = { top: 0, left: 0 };
        if (barRef?.current) {
            const boundingClientRect = barRef.current.getBoundingClientRect();
            offsetPosition.top = boundingClientRect.top;
            offsetPosition.left = boundingClientRect.left + boundingClientRect.width / 2;
        }
        onMouseEnter(offsetPosition);
    }, [onMouseEnter]);

    React.useEffect(() => {
        setStyle({
            backgroundColor: color,
            [cssProperty]: adjustedSize === 0 ? '2px' : `${adjustedSize}%`,
        });
    }, [adjustedSize, color, cssProperty]);

    return (
        <div
            ref={barRef}
            className={classNames('ca-Bar', { 'is-horizontal': isHorizontal })}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={onMouseLeave}
            role="presentation"
        >
            <div className="ca-Bar-value" style={style} />
            {label && <div className="ca-Bar-label">{label}</div>}
        </div>
    );
}

export default Bar;
