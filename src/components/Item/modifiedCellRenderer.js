/**
 * @flow
 * @file Function to render the Modified table cell
 * @author sghosh326
 */

import React from 'react';
import ItemModified from './ItemModified';
import type { View, BoxItem } from '../../flowTypes';

export default (rootId: string, view: View) => ({ rowData }: { rowData: BoxItem }) => (
    <ItemModified item={rowData} view={view} />
);
