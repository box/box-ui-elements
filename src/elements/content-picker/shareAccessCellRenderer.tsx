/**
 * @file Function to render the share access table cell
 * @author Box
 */

import * as React from 'react';
import getProp from 'lodash/get';
import ShareAccessSelect from '../common/share-access-select';
import isRowSelectable from './cellRendererHelper';
import LoadingIndicator from '../../components/loading-indicator';
import { BoxItem } from '../../common/types/core';

interface ShareAccessCellRendererProps {
    rowData: BoxItem;
}

type ShareAccessCellRenderer = (props: ShareAccessCellRendererProps) => JSX.Element;

export default (
        onChange: (item: BoxItem) => void,
        canSetShareAccess: boolean,
        selectableType: string,
        extensionsWhitelist: string[],
        hasHitSelectionLimit: boolean,
    ): ShareAccessCellRenderer =>
    ({ rowData }: ShareAccessCellRendererProps) => {
        const itemCanSetShareAccess = getProp(rowData, 'permissions.can_set_share_access', false);

        if (
            !canSetShareAccess ||
            !itemCanSetShareAccess ||
            !isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData) ||
            !rowData.selected
        ) {
            return <span />;
        }

        const { allowed_shared_link_access_levels } = rowData;
        const isLoading = !allowed_shared_link_access_levels;

        return isLoading ? (
            <div data-testid="bcp-share-access-loading">
                <LoadingIndicator className="bcp-share-access-loading" />
            </div>
        ) : (
            <div data-testid="bcp-shared-access-select">
                <ShareAccessSelect
                    canSetShareAccess={canSetShareAccess}
                    className="bcp-shared-access-select"
                    item={rowData}
                    onChange={onChange}
                />
            </div>
        );
    };
