/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconApps = ({ color = '#aaa', className = '', width = 18, height = 18 }: IconType) =>
    <svg width={width} height={height} role='img' viewBox='0 0 18 18' className={className}>
        <path
            fill='none'
            stroke={color}
            strokeWidth='2'
            d='M2 1c-.552 0-1 .448-1 1v4c0 .552.448 1 1 1h4c.552 0 1-.448 1-1V2c0-.552-.448-1-1-1H2zm0 10c-.552 0-1 .448-1 1v4c0 .552.448 1 1 1h4c.552 0 1-.448 1-1v-4c0-.552-.448-1-1-1H2zM12 1c-.552 0-1 .448-1 1v4c0 .552.448 1 1 1h4c.552 0 1-.448 1-1V2c0-.552-.448-1-1-1h-4zm0 10c-.552 0-1 .448-1 1v4c0 .552.448 1 1 1h4c.552 0 1-.448 1-1v-4c0-.552-.448-1-1-1h-4z'
        />
    </svg>;

export default IconApps;
