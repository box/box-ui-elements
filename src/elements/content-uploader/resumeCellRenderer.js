/**
 * @flow
 * @file Function to render the resume table cell
 */

import React from 'react';
import ItemResume from './ItemResume';

type Props = {
    rowData: UploadItem,
};

export default (onClick: Function) => ({ rowData }: Props) => (
    <ItemResume {...rowData} onClick={() => onClick(rowData)} />
);
