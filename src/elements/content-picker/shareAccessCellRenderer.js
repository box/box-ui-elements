/**
 * @flow
 * @file Function to render the share access table cell
 * @author Box
 */

import React from 'react';
import getProp from 'lodash/get';
import ShareAccessSelect from '../common/share-access-select';
import isRowSelectable from './cellRendererHelper';
import { isSelected as isRowSelected } from './itemSelectionHelper';
import LoadingIndicator from '../../components/loading-indicator';

export default (
    onChange: Function,
    canSetShareAccess: boolean,
    selectableType: string,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean,
    selected: Array<BoxItem>,
) => ({ rowData }: { rowData: BoxItem }) => {
    const itemCanSetShareAccess = getProp(rowData, 'permissions.can_set_share_access', false);
    const isSelected = isRowSelected(rowData, selected);

    if (
        !canSetShareAccess ||
        !itemCanSetShareAccess ||
        !isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData, isSelected) ||
        !isSelected
    ) {
        return <span />;
    }

    const { allowed_shared_link_access_levels } = rowData;
    const isLoading = !allowed_shared_link_access_levels;

    return isLoading ? (
        <LoadingIndicator className="bcp-share-access-loading" />
    ) : (
        <ShareAccessSelect
            canSetShareAccess={canSetShareAccess}
            className="bcp-shared-access-select"
            item={rowData}
            onChange={onChange}
        />
    );
};
