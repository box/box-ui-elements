// @flow
import * as React from 'react';
import { defaultRowRenderer } from '@box/react-virtualized/dist/es/Table/index';
import Ghost from '../../components/ghost';
import type { RowRendererParams } from './flowTypes';

const loadingRowRenderer = (params: RowRendererParams) => {
    const { columns } = params;
    const loadingCell = <Ghost key="loading" borderRadius={15} height={15} width="50%" />;

    const mappedColumns = columns.map(column => React.cloneElement(column, null, [loadingCell]));

    return defaultRowRenderer({
        ...params,
        columns: mappedColumns,
    });
};

export default loadingRowRenderer;
