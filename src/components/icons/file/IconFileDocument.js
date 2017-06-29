/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileDocument = ({ className = '', width = 32, height = 32 }: IconType) =>
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
        <rect x='10.5' y='20.6' fill='#3FA3DB' width='11' height='1' />
        <rect x='15.5' y='14.6' fill='#3FA3DB' width='6' height='1' />
        <rect x='16.5' y='17.6' fill='#3FA3DB' width='5' height='1' />
        <path
            fill='#3FA3DB'
            d='M11.8,18.1h2.4l0.2,0.5h1.1l-1.9-3.8c-0.1-0.3-0.4-0.5-0.7-0.5c0,0,0,0,0,0c-0.3,0-0.5,0.2-0.7,0.5
            l-1.9,3.8h1.1L11.8,18.1z M13.1,15.7l0.7,1.4h-1.4L13.1,15.7z'
        />
    </svg>;

export default IconFileDocument;
