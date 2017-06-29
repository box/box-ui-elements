/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import { BOX_BLUE } from '../../constants';
import type { IconType } from '../../flowTypes';

const IconCheck = ({ color = BOX_BLUE, className = '', width = 16.88, height = 13.34 }: IconType) =>
    <svg width={width} height={height} viewBox='0 0 16.88 13.34' role='img' className={className}>
        <path fill={color} fillRule='evenodd' d='M16.88 1.78L15 0 5.32 9.8 1.77 6.25 0 8.02 5.33 13.34 16.88 1.78' />
    </svg>;

export default IconCheck;
