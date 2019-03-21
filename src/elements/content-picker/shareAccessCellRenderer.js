/**
 * @flow
 * @file Function to render the share access table cell
 * @author Box
 */

import React from 'react';
import ShareAccessSelect from '../common/share-access-select';
import isRowSelectable from './cellRendererHelper';
import LoadingIndicator from '../../components/loading-indicator';

export default (
    onChange: Function,
    canSetShareAccess: boolean,
    selectableType: string,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean,
) => ({ rowData }: { rowData: BoxItem }) => {
    if (!isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData) || !rowData.selected) {
        return <span />;
    }

    const { allowed_shared_link_access_levels } = rowData;
    const isLoading = !allowed_shared_link_access_levels;

    return isLoading ? (
        <LoadingIndicator className="bcp-ShareAccessSelect--loading" />
    ) : (
        <ShareAccessSelect
            canSetShareAccess={canSetShareAccess}
            className="bcp-shared-access-select"
            item={rowData}
            onChange={onChange}
        />
    );
};
