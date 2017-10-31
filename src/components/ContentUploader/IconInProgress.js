/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import IconCross from '../icons/IconCross';
import LoadingIndicator from '../LoadingIndicator';
import type { IconType } from '../../flowTypes';

const IconInProgress = ({ color = '#222', className = '', width = 14, height = 14 }: IconType) =>
    <div className='buik-icon-in-progress'>
        <IconCross className={className} color={color} width={width} height={height} />
        <LoadingIndicator className='buik-btn-loading-indicator' />
    </div>;

export default IconInProgress;
