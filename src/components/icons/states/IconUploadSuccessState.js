/**
 * @flow
 * @file Empty state icon
 * @author Box
 */

import React from 'react';
import { BOX_BLUE, BOX_BLUE_LIGHT } from '../../../constants';
import type { IconType } from '../../../flowTypes';

const IconUploadSuccessState = ({
    className = '',
    color = BOX_BLUE,
    secondaryColor = BOX_BLUE_LIGHT,
    height = 49,
    width = 50
}: IconType) =>
    <svg className={className} height={height} role='img' viewBox='0 0 50 49' width={width}>
        <path
            fill={color}
            d='M41.88,4.39l4,4.53L17,38.73,4.24,26,9,21.28l5.89,6.09L17,29.57l2.16-2.18,22.74-23M42,0,17,25.28,9,17,0,26,17,43,50,9,42,0Z'
        />
        <rect width='6' height='3' x='4' y='46' fill={secondaryColor} rx='1.5' ry='1.5' />
        <rect width='6' height='3' x='33' y='46' fill={secondaryColor} rx='1.5' ry='1.5' />
        <rect width='21' height='3' x='11' y='46' fill={secondaryColor} rx='1.5' ry='1.5' />
    </svg>;

export default IconUploadSuccessState;
