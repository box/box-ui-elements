// @flow
import classNames from 'classnames';
import { defaultRowRenderer } from 'react-virtualized/dist/es/Table/index';

import type { RowRendererParams } from './flowTypes';

const selectableRowRenderer = (params: RowRendererParams, selectedId?: ?string) => {
    const { className, rowData } = params;
    const { id } = rowData;
    const rowRendererClass = classNames(className, { 'is-selected': selectedId === id });

    return defaultRowRenderer({
        ...params,
        className: rowRendererClass,
    });
};

export default selectableRowRenderer;
