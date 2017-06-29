/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileAudio = ({ className = '', width = 32, height = 32 }: IconType) =>
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
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#965DA6'
            d='M13,13c-0.3,0-0.5,0.2-0.5,0.5v6.6C12.3,20,12.2,20,12,20
            c-0.8,0-1.5,0.7-1.5,1.5c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5V17h6v3.1C19.3,20,19.2,20,19,20c-0.8,0-1.5,0.7-1.5,1.5
            c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5v-8c0-0.3-0.2-0.5-0.5-0.5H13z M19.5,16h-6v-2h6V16z'
        />
    </svg>;

export default IconFileAudio;
