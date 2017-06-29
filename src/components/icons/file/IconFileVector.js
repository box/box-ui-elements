/**
 * @flow
 * @file File icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFileVector = ({ className = '', width = 32, height = 32 }: IconType) =>
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
        <defs>
            <circle id='SVGID_1_VECTOR' cx='16' cy='16' r='1.5' />
        </defs>
        <clipPath id='SVGID_2_VECTOR'>
            <use xlinkHref='#SVGID_1_VECTOR' overflow='visible' />
        </clipPath>
        <g clipPath='url(#SVGID_2_VECTOR)'>
            <defs>
                <rect id='SVGID_3_VECTOR' x='9.5' y='13.5' width='13' height='9' />
            </defs>
            <clipPath id='SVGID_4_VECTOR'>
                <use xlinkHref='#SVGID_3_VECTOR' overflow='visible' />
            </clipPath>
        </g>
        <path fill='#FFFFFF' d='M16,15.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5S16.3,15.5,16,15.5z' />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            fill='#F79420'
            d='M22.5,15.5h-4.6c-0.2-0.9-1-1.5-1.9-1.5s-1.7,0.6-1.9,1.5H9.5v1
            h4.2c-1.7,0.7-3,2.2-3.5,4.1c-0.4,0.1-0.7,0.5-0.7,0.9c0,0.6,0.4,1,1,1s1-0.4,1-1c0-0.3-0.1-0.5-0.3-0.7c0.4-1.7,1.7-3,3.3-3.5
            c0.4,0.5,0.9,0.7,1.5,0.7s1.2-0.3,1.5-0.7c1.6,0.5,2.9,1.9,3.3,3.5c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.6,0.4,1,1,1s1-0.4,1-1
            c0-0.4-0.3-0.8-0.7-0.9c-0.5-1.8-1.8-3.3-3.5-4.1h4.2V15.5z M16,17c-0.6,0-1-0.4-1-1c0-0.6,0.4-1,1-1s1,0.4,1,1
            C17,16.6,16.6,17,16,17z'
        />
    </svg>;

export default IconFileVector;
