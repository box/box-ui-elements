/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileBookmark = ({ className = '', width = 32, height = 32 }: IconType) =>
    <svg className={className} width={width} height={height} viewBox='0 0 32 32' role='img'>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#75818C'
            d='M24.5,27.5h-17c-0.6,0-1-0.4-1-1v-21c0-0.6,0.4-1,1-1l17,0
            c0.6,0,1,0.4,1,1v21C25.5,27.1,25.1,27.5,24.5,27.5z'
        />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#FFFFFF'
            d='M24.5,9.5V26c0,0.3-0.2,0.5-0.5,0.5H8c-0.3,0-0.5-0.2-0.5-0.5V9.5
            L24.5,9.5z'
        />
        <rect x='7.5' y='6.5' fillRule='evenodd' clipRule='evenodd' fill='#FFFFFF' width='1' height='1' />
        <rect x='9.5' y='6.5' fillRule='evenodd' clipRule='evenodd' fill='#FFFFFF' width='1' height='1' />
        <rect x='11.5' y='6.5' fillRule='evenodd' clipRule='evenodd' fill='#FFFFFF' width='1' height='1' />
        <path
            fill='#75818C'
            d='M16.4,21.9c-1.1,1.1-3.1,1.1-4.2,0c-0.6-0.6-0.9-1.3-0.9-2.1c0-0.8,0.3-1.6,0.9-2.1l1.4-1.4l-0.7-0.7
            l-1.4,1.4c-0.8,0.8-1.2,1.8-1.2,2.8c0,1.1,0.4,2.1,1.2,2.8c0.8,0.8,1.8,1.2,2.8,1.2c1.1,0,2.1-0.4,2.8-1.2l1.4-1.4l-0.7-0.7
            L16.4,21.9z'
        />
        <path
            fill='#75818C'
            d='M20.6,13.4c-1.6-1.6-4.1-1.6-5.7,0l-1.4,1.4l0.7,0.7l1.4-1.4c0.6-0.6,1.4-0.9,2.1-0.9
            c0.8,0,1.5,0.3,2.1,0.9c1.2,1.2,1.2,3.1,0,4.2l-1.4,1.4l0.7,0.7l1.4-1.4C22.2,17.5,22.2,15,20.6,13.4z'
        />
        <rect
            x='15.5'
            y='16'
            transform='matrix(0.7071 0.7071 -0.7071 0.7071 17.4143 -6.0416)'
            fill='#75818C'
            width='1'
            height='4'
        />
    </svg>;

export default IconFileBookmark;
