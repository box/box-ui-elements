/**
 * @flow
 * @file Function to render the name table cell
 */

import React from 'react';
import IconName from './IconName';

type Props = {
    rowData: UploadItem,
};

export default (isResumableUploadsEnabled: boolean) => ({ rowData }: Props) => (
    <IconName isResumableUploadsEnabled={isResumableUploadsEnabled} {...rowData} />
);
