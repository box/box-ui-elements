import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import { Icon } from '../iconTypes';

const IconRename = ({
    className = '',
    color = '#444',
    height = 13,
    title,
    width = 14,
    isEnhancement = false,
}: Icon) => (
    <AccessibleSVG
        className={`icon-rename ${className}`}
        viewBox={isEnhancement ? '0 0 16 16' : '0 0 14 13'}
        height={height}
        width={width}
        title={title}
    >
        <path
            className="fill-color"
            d={
                isEnhancement
                    ? 'M2.237 10l2.829 2.828-3.398 1.184c-.52.18-.791-.105-.614-.614L2.237 10zM14 12a1 1 0 010 2H9a1 1 0 010-2h5zm-1.49-9.586a2 2 0 010 2.829l-6.473 6.473L3.21 8.887l6.473-6.473a2.001 2.001 0 012.828 0z'
                    : 'M3.8 7.6l-.4.4 2.5 2.5L13.3 3c.2-.2.3-.5.3-.7 0-.3-.1-.5-.3-.7L11.9.2c-.2-.2-.5-.3-.7-.3-.3 0-.5.1-.7.3L3.1 7.6l.3.4.4-.4.3.4 7-7 1.4 1.4L5.9 9 4.1 7.3l-.3.3.3.4-.3-.4zm-1.6.9L5 11.3l-3.4 1.2c-.5.2-.8-.1-.6-.6l1.2-3.4zm3.9 3h7v1h-7z'
            }
            fill={color}
            fillRule={isEnhancement ? 'evenodd' : undefined}
        />
    </AccessibleSVG>
);

export default IconRename;
