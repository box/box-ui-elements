/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileCode = ({ className = '', width = 32, height = 32 }: IconType) =>
    <svg className={className} width={width} height={height} viewBox='0 0 32 32' role='img'>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#E43F56'
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
        <path fillRule='evenodd' clipRule='evenodd' fill='#E43F56' d='M19.5,4.5l6,6h-5c-0.6,0-1-0.4-1-1V4.5z' />
        <polygon
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#E43F56'
            points='12.5,22.5 12.5,19.5 11.5,19.5 11.5,23.5 14.5,23.5
            14.5,22.5'
        />
        <polygon
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#E43F56'
            points='12.5,13.5 12.5,16.5 11.5,16.5 11.5,12.5 14.5,12.5
            14.5,13.5'
        />
        <rect x='10.5' y='18.5' fillRule='evenodd' clipRule='evenodd' fill='#E43F56' width='1' height='1' />
        <rect x='9.5' y='17.5' fillRule='evenodd' clipRule='evenodd' fill='#E43F56' width='1' height='1' />
        <rect x='10.5' y='16.5' fillRule='evenodd' clipRule='evenodd' fill='#E43F56' width='1' height='1' />
        <polygon
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#E43F56'
            points='19.5,13.5 19.5,16.5 20.5,16.5 20.5,12.5 17.5,12.5
            17.5,13.5'
        />
        <polygon
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#E43F56'
            points='19.5,22.5 19.5,19.5 20.5,19.5 20.5,23.5 17.5,23.5
            17.5,22.5'
        />
        <rect x='20.5' y='16.5' fillRule='evenodd' clipRule='evenodd' fill='#E43F56' width='1' height='1' />
        <rect x='21.5' y='17.5' fillRule='evenodd' clipRule='evenodd' fill='#E43F56' width='1' height='1' />
        <rect x='20.5' y='18.5' fillRule='evenodd' clipRule='evenodd' fill='#E43F56' width='1' height='1' />
    </svg>;

export default IconFileCode;
