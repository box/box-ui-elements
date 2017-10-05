/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconDetails = ({ color = '#aaa', className = '', width = 16, height = 21 }: IconType) =>
    <svg width={width} height={height} role='img' viewBox='0 0 16 21' className={className}>
        <g fill='none' fillRule='evenodd' stroke={color} strokeWidth='2'>
            <path d='M2.0000109.99997817V1c-.55228208.00000603-1 .44772545-1.0000109 1v17c0 .5522847.44771525 1 1 1h12c.5522847 0 1-.4477153 1-1V6.82831798c0-.2652165-.1053568-.5195704-.2928932-.70710678L9.8786887 1.29279312C9.69114965 1.10525407 9.43679127.999897 9.171571.9998999L2.0000109.99997817z' />
            <path d='M8 10.4V14m0-7' strokeLinecap='round' />
            <path d='M8,7 L8,7' strokeLinecap='round' />
        </g>
    </svg>;

export default IconDetails;
