import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

import { Icon } from '../iconTypes';

const IconEllipsis = ({
    className = '',
    color = '#000000',
    height = 20,
    title,
    width = 20,
    isEnhancement = false,
}: Icon) => (
    <AccessibleSVG
        className={`icon-ellipsis ${className}`}
        viewBox={isEnhancement ? '0 0 16 16' : '0 0 10 2'}
        width={width}
        height={height}
        title={title}
        style={{ marginTop: isEnhancement ? '1px' : 0 }}
    >
        <path
            className="fill-color"
            d={
                isEnhancement
                    ? 'M5 8C5 8.828 4.328 9.5 3.5 9.5C2.672 9.5 2 8.828 2 8C2 7.172 2.672 6.5 3.5 6.5C4.328 6.5 5 7.172 5 8ZM9.5 8C9.5 8.828 8.828 9.5 8 9.5C7.172 9.5 6.5 8.828 6.5 8C6.5 7.172 7.172 6.5 8 6.5C8.828 6.5 9.5 7.172 9.5 8ZM14 8C14 8.828 13.328 9.5 12.5 9.5C11.672 9.5 11 8.828 11 8C11 7.172 11.672 6.5 12.5 6.5C13.328 6.5 14 7.172 14 8Z'
                    : 'M1 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm8 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zM5 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z'
            }
            fill={color}
            fillRule={isEnhancement ? 'evenodd' : undefined}
        />
    </AccessibleSVG>
);

export default IconEllipsis;
