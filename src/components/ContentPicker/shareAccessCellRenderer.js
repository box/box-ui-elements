/**
 * @flow
 * @file Function to render the share access table cell
 * @author Box
 */

import React from 'react';
import isRowSelectable from './cellRendererHelper';
import ShareAccessSelect from '../ShareAccessSelect';

export default (
    onChange: Function,
    canSetShareAccess: boolean,
    selectableType: string,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean
) => ({ rowData }: { rowData: BoxItem }) => {
    if (!isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData)) {
        return <span />;
    }

    return (
        <ShareAccessSelect
            className="bcp-shared-access-select"
            canSetShareAccess={canSetShareAccess}
            onChange={onChange}
            item={rowData}
        />
    );
};
