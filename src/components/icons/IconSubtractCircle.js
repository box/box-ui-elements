/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconSubtractCircle = ({ color = '#777', className = '', width = 24, height = 24 }: IconType) =>
    <svg width={width} height={height} role='img' viewBox='0 0 24 24' className={className}>
        <path
            fill={color}
            fillRule='evenodd'
            d='M5.5 12.5v-1h13v1h-13zM12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm0-1c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'
        />
    </svg>;

export default IconSubtractCircle;
