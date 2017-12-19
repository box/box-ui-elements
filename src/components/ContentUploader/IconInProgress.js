/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import IconCross from '../icons/IconCross';
import type { IconType } from '../../flowTypes';

const IconInProgress = ({ color = '#222', className = '', width = 14, height = 14 }: IconType) =>
    <div className='buik-icon-in-progress'>
        <IconCross className={className} color={color} width={width} height={height} />
    </div>;

export default IconInProgress;
