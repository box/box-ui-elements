/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileBoxNote = ({ className = '', width = 32, height = 32 }: IconType) =>
    <svg className={className} width={width} height={height} viewBox='0 0 32 32' role='img'>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#1E8392'
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
        <path fillRule='evenodd' clipRule='evenodd' fill='#1E8392' d='M19.5,4.5l6,6h-5c-0.6,0-1-0.4-1-1V4.5z' />
        <rect x='9.8' y='16.1' fillRule='evenodd' clipRule='evenodd' fill='#1E8392' width='7' height='1' />
        <rect x='9.8' y='19.1' fillRule='evenodd' clipRule='evenodd' fill='#559644' width='4' height='1' />
        <rect x='9.8' y='22.1' fillRule='evenodd' clipRule='evenodd' fill='#93AE40' width='2' height='1' />
        <polygon
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#2D3F50'
            points='14,23.1 14,23.1 20,17.1 17.9,15 11.9,21 11.9,21
            11.9,21 11.9,23.1 14,23.1'
        />
        <rect
            x='18.9'
            y='13.6'
            transform='matrix(-0.7071 -0.7071 0.7071 -0.7071 24.4534 39.4114)'
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#75818C'
            width='3'
            height='2'
        />
    </svg>;

export default IconFileBoxNote;
