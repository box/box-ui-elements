/**
 * @flow
 * @file Function to render the name table cell
 */

import React from 'react';
import IconName from './IconName';
import type { UploadItem } from '../../common/types/upload';

type Props = {
    rowData: UploadItem,
};

export default (isResumableUploadsEnabled: boolean) => ({ rowData }: Props) => (
    <IconName isResumableUploadsEnabled={isResumableUploadsEnabled} {...rowData} />
);
