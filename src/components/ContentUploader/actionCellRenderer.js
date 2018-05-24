/**
 * @flow
 * @file Function to render the action table cell
 */

import React from 'react';
import ItemAction from './ItemAction';

type Props = {
    rowData: UploadItem
};

export default (onClick: Function) => ({ rowData }: Props) => (
    <ItemAction {...rowData} onClick={() => onClick(rowData)} />
);
