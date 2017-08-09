/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconPlus = ({ className = '', width = 15, height = 15 }: IconType) =>
    <svg width={width} height={height} role='img' viewBox='0 0 17 17' className={className}>
        <path fill='#222' d='M8 0h1v17H8z' />
        <path fill='#222' d='M17 8v1H0V8z' />
    </svg>;

export default IconPlus;
