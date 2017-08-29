/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconSidebar = ({ className = '', color = '#777', width = 16, height = 18 }: IconType) =>
    <svg viewBox='0 0 18 16' width={width} height={height} role='img' className={className}>
        <path fill={color} d='M13 3h2v2h-2zM13 6h2v2h-2z' />
        <path
            fill={color}
            d='M16 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM2 14V2h8v12H2zM12 2h4v12h-4V2z'
        />
    </svg>;

export default IconSidebar;
