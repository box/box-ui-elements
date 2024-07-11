/**
 * @flow
 * @file Function to render the icon table cell
 * @author Box
 */

import * as React from 'react';

import IconCell from './IconCell';
import type { BoxItem } from '../../../common/types/core';

export default (dimension: number = 32) => ({ rowData }: { rowData: BoxItem }) => (
    <div className="be-item-icon">
        <IconCell rowData={rowData} dimension={dimension} />
    </div>
);
