/**
 * @flow
 * @file Icon
 * @author Box
 */

// @TODO(tjin): Replace this with real retry icon for retrying an upload
import React from 'react';
import { COLOR_RED } from '../../constants';
import type { IconType } from '../../flowTypes';

const IconRetry = ({ color = COLOR_RED, className = '', width = 14, height = 16 }: IconType) =>
    <svg width={width} height={height} viewBox='0 0 14 16' role='img' className={className}>
        <path d='M13,8a1,1,0,0,0-1,1A5,5,0,1,1,7,4V6l5-3L7,0V2a7,7,0,1,0,7,7A1,1,0,0,0,13,8Z' fill={color} />
    </svg>;

export default IconRetry;
