/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconRightArrow = ({ color = '#999', className = '', width = 7, height = 10 }: IconType) =>
    <svg width={width} height={height} viewBox='0 0 8 13' role='img' className={className}>
        <path d='M.1 11.3l4.6-4.5L.1 2.2 1.5.8l6 6-6 6-1.4-1.5z' fill={color} fillRule='evenodd' />
    </svg>;

export default IconRightArrow;
