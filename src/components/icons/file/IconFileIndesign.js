/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileIndesign = ({ className = '', width = 32, height = 32 }: IconType) =>
    <svg className={className} width={width} height={height} viewBox='0 0 32 32' role='img'>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#965DA6'
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
        <path fillRule='evenodd' clipRule='evenodd' fill='#965DA6' d='M19.5,4.5l6,6h-5c-0.6,0-1-0.4-1-1V4.5z' />
        <path fill='#965DA6' d='M13.3,20.5h-1.5V14h1.5V20.5z' />
        <path
            fill='#965DA6'
            d='M20.6,17.3c0,0.5-0.1,0.9-0.2,1.3c-0.2,0.4-0.4,0.7-0.7,1c-0.3,0.3-0.7,0.5-1.1,0.7
            c-0.4,0.2-0.9,0.2-1.4,0.2h-2.5V14h2.5c0.5,0,1,0.1,1.4,0.2c0.4,0.2,0.8,0.4,1.1,0.7s0.5,0.6,0.7,1C20.5,16.4,20.6,16.8,20.6,17.3
            z M19,17.3c0-0.3,0-0.6-0.1-0.9c-0.1-0.3-0.2-0.5-0.4-0.7c-0.2-0.2-0.3-0.3-0.6-0.4c-0.2-0.1-0.5-0.1-0.8-0.1h-1v4.2h1
            c0.3,0,0.6,0,0.8-0.1c0.2-0.1,0.4-0.2,0.6-0.4c0.2-0.2,0.3-0.4,0.4-0.7C19,17.9,19,17.6,19,17.3z'
        />
    </svg>;

export default IconFileIndesign;
