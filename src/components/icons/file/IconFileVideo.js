/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileVideo = ({ className = '', width = 32, height = 32 }: IconType) =>
    <svg className={className} width={width} height={height} viewBox='0 0 32 32' role='img'>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#3FA3DB'
            d='M24.5,27.5h-17c-0.6,0-1-0.4-1-1v-21c0-0.6,0.4-1,1-1h12l6,6v16
            C25.5,27.1,25.1,27.5,24.5,27.5z'
        />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#FFFFFF'
            d='M24,26.5H8c-0.3,0-0.5-0.2-0.5-0.5V6c0-0.3,0.2-0.5,0.5-0.5h11.5
            l5,5V26C24.5,26.3,24.3,26.5,24,26.5z'
        />
        <path fillRule='evenodd' clipRule='evenodd' fill='#3FA3DB' d='M19.5,4.5l6,6h-5c-0.6,0-1-0.4-1-1V4.5z' />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#3FA3DB'
            d='M13.8,13.1l5.9,3.5c0.3,0.2,0.3,0.7,0,0.9l-5.9,3.5
            c-0.3,0.2-0.8,0-0.8-0.4v-7C13,13.1,13.4,12.9,13.8,13.1z'
        />
    </svg>;

export default IconFileVideo;
