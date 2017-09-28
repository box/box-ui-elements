/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconAddCircle = ({ color = '#777', className = '', width = 24, height = 24 }: IconType) =>
    <svg width={width} height={height} role='img' viewBox='0 0 24 24' className={className}>
        <path
            fill={color}
            fillRule='evenodd'
            d='M12.5 23C18.85 23 24 17.85 24 11.5S18.85 0 12.5 0 1 5.15 1 11.5 6.15 23 12.5 23zm0-1C18.3 22 23 17.3 23 11.5S18.3 1 12.5 1 2 5.7 2 11.5 6.7 22 12.5 22zM6 12v-1h6V5h1v6h6v1h-6v6h-1v-6H6z'
        />
    </svg>;

export default IconAddCircle;
