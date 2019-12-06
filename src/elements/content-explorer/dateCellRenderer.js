/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import Date from './Date';
import type { BoxItem } from '../../common/types/core';

export default () => ({ dataKey, rowData }: { dataKey: string, rowData: BoxItem }) => (
    <Date dataKey={dataKey} item={rowData} />
);
