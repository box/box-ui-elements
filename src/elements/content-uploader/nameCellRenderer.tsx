import * as React from 'react';
import IconName from './IconName';
import { cellRendererProps } from './ItemList';

export default (isResumableUploadsEnabled: boolean) =>
    ({ rowData }: cellRendererProps) => <IconName isResumableUploadsEnabled={isResumableUploadsEnabled} {...rowData} />;
