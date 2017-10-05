/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconComments = ({ color = '#aaa', className = '', width = 20, height = 19 }: IconType) =>
    <svg width={width} height={height} role='img' viewBox='0 0 20 19' className={className}>
        <g fill='none' stroke={color}>
            <path
                strokeWidth='2'
                d='M4 17.483L9.795 15H12c3.866 0 7-3.134 7-7s-3.134-7-7-7H8C4.134 1 1 4.134 1 8c0 2.153.977 4.144 2.625 5.465l.375.3v3.718z'
            />
            <circle cx='6' cy='8' r='1' />
            <circle cx='10' cy='8' r='1' />
            <circle cx='14' cy='8' r='1' />
        </g>
    </svg>;

export default IconComments;
