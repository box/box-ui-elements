import React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { Direction } from '../types';

import './Bar.scss';

const DEFAULT_SIZE = 50;

interface Props {
    color?: string;
    direction?: Direction;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    size: number;
}

function Bar({ color, direction = 'vertical', onMouseEnter = noop, onMouseLeave = noop, size = DEFAULT_SIZE }: Props) {
    const isHorizontal = direction === 'horizontal';
    const cssProperty = direction === 'horizontal' ? 'width' : 'height';
    const [style, setStyle] = React.useState({
        backgroundColor: color,
        [cssProperty]: '0%',
    });

    const adjustedSize = Math.max(0, size);

    React.useEffect(() => {
        setStyle({
            backgroundColor: color,
            [cssProperty]: adjustedSize === 0 ? '2px' : `${adjustedSize}%`,
        });
    }, [adjustedSize, color, cssProperty]);

    return (
        <div
            className={classNames('ca-Bar', { 'is-horizontal': isHorizontal })}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role="presentation"
        >
            <div className="ca-Bar-value" style={style} />
        </div>
    );
}

export default Bar;
