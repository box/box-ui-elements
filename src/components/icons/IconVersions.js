/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconVersions = ({ color = '#aaa', className = '', width = 18, height = 18 }: IconType) =>
    <svg width={width} height={height} role='img' viewBox='0 0 18 18' className={className}>
        <g fill='none' stroke={color}>
            <rect width='1' height='4' x='8.5' y='5.5' rx='.5' />
            <rect width='1' height='5' x='.5' y='.5' rx='.5' />
            <rect width='4' height='1' x='8.5' y='8.5' rx='.5' />
            <rect width='5' height='1' x='.5' y='4.5' rx='.5' />
            <path
                strokeWidth='2'
                d='M2 12.5c1.327 2.238 3.767 3.738 6.558 3.738 4.208 0 7.62-3.41 7.62-7.62C16.178 4.412 12.765 1 8.558 1 5.767 1 3.327 2.5 2 4.738'
                strokeLinecap='round'
            />
        </g>
    </svg>;

export default IconVersions;
