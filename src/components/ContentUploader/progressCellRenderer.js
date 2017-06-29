/**
 * @flow
 * @file Function to render the progress table cell
 */

import React from 'react';
import ItemProgress from './ItemProgress';
import { STATUS_PENDING } from '../../constants';
import type { UploadItem } from '../../flowTypes';

type Props = {
    rowData: UploadItem
};

export default () => ({ rowData }: Props) => (rowData.status !== STATUS_PENDING ? <ItemProgress {...rowData} /> : null);
