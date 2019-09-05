/**
 * @flow
 * @file Function to render the action table cell
 */

import React from 'react';
import ItemAction from './ItemAction';

type Props = {
    rowData: UploadItem,
};

export default (isResumableUploadsEnabled: boolean, onClick: Function) => ({ rowData }: Props) => (
    <ItemAction {...rowData} isResumableUploadsEnabled={isResumableUploadsEnabled} onClick={() => onClick(rowData)} />
);
