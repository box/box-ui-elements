/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileImage = ({ className = '', width = 32, height = 32 }: IconType) =>
    <svg className={className} width={width} height={height} viewBox='0 0 32 32' role='img'>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#F79420'
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
        <path fillRule='evenodd' clipRule='evenodd' fill='#F79420' d='M19.5,4.5l6,6h-5c-0.6,0-1-0.4-1-1V4.5z' />
        <path
            fill='#F79420'
            d='M17.8,20.5h-1.2c-0.1,0-0.2,0-0.3-0.1c-0.1-0.1-0.1-0.1-0.2-0.2l-0.4-1.1h-2.5l-0.4,1.1
            c0,0.1-0.1,0.2-0.2,0.2c-0.1,0.1-0.2,0.1-0.3,0.1h-1.2l2.5-6.6h1.6L17.8,20.5z M13.6,18h1.8l-0.6-1.8c0-0.1-0.1-0.2-0.1-0.4
            c-0.1-0.2-0.1-0.3-0.2-0.5c0,0.2-0.1,0.4-0.1,0.5c0,0.2-0.1,0.3-0.1,0.4L13.6,18z'
        />
        <path fill='#F79420' d='M20.2,20.5h-1.5V14h1.5V20.5z' />
    </svg>;

export default IconFileImage;
