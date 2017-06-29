/**
 * @flow
 * @file Function to render the name table cell
 */

import React from 'react';
import IconName from './IconName';
import type { UploadItem } from '../../flowTypes';

type Props = {
    rowData: UploadItem
};

export default () => ({ rowData }: Props) => <IconName {...rowData} />;
