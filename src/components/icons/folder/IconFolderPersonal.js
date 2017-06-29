/**
 * @flow
 * @file Folder icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../../flowTypes';

const IconFolderPersonal = ({ className = '', width = 32, height = 32 }: IconType) =>
    <svg className={className} width={width} height={height} viewBox='0 0 32 32' role='img'>
        <path
            fill='#EFD289'
            d='M27,25H5c-0.6,0-1-0.4-1-1V8c0-0.6,0.4-1,1-1h8.6L16,9h11c0.6,0,1,0.4,1,1v14C28,24.6,27.6,25,27,25z'
        />
        <path fill='#FDEFC1' d='M26.5,24h-21C5.2,24,5,23.8,5,23.5V12h22v11.6C27,23.8,26.8,24,26.5,24z' />
    </svg>;

export default IconFolderPersonal;
