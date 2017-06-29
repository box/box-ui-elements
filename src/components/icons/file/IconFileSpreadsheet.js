/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileSpreadsheet = ({ className = '', width = 32, height = 32 }: IconType) =>
    <svg className={className} width={width} height={height} viewBox='0 0 32 32' role='img'>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#40B780'
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
        <path fillRule='evenodd' clipRule='evenodd' fill='#40B780' d='M19.5,4.5l6,6h-5c-0.6,0-1-0.4-1-1V4.5z' />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#40B780'
            d='M22,13H10c-0.3,0-0.5,0.2-0.5,0.5v9c0,0.3,0.2,0.5,0.5,0.5h12
            c0.3,0,0.5-0.2,0.5-0.5v-9C22.5,13.2,22.3,13,22,13z M10.5,14h3v2h-3V14z M10.5,17h3v2h-3V17z M21.5,22h-11v-2h3v2h1v-2h7V22z
            M21.5,19h-7v-2h7V19z M21.5,16h-7v-2h7V16z'
        />
    </svg>;

export default IconFileSpreadsheet;
