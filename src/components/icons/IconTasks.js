/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconTasks = ({ color = '#aaa', className = '', width = 18, height = 19 }: IconType) =>
    <svg width={width} height={height} role='img' viewBox='0 0 18 19' className={className}>
        <path
            fill='none'
            stroke={color}
            strokeWidth='2'
            d='M7 8l3 3 7-6c-1.8-2.392-4.472-4-8-4-4.202 0-8 3.806-8 9 0 4.194 3.798 8 8 8 3.748 0 6.582-1.85 8-5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>;

export default IconTasks;
