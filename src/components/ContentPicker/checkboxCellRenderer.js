/**
 * @flow
 * @file Function to render the checkbox table cell
 * @author Box
 */

import React from 'react';
import isRowSelectable from './cellRendererHelper';
import { CLASS_CHECKBOX_SPAN } from '../../constants';
import type { BoxItem } from '../../flowTypes';

export default (
    onItemSelect: Function,
    selectableType: string,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean
): Function => ({ rowData }: { rowData: BoxItem }) => {
    const { selected = false } = rowData;

    if (!isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData)) {
        return <span />;
    }

    /* eslint-disable jsx-a11y/label-has-for */
    return (
        <label className='buik-checkbox'>
            <input type='checkbox' checked={selected} onChange={() => onItemSelect(rowData)} />
            <span className={CLASS_CHECKBOX_SPAN} />
        </label>
    );
    /* eslint-enable jsx-a11y/label-has-for */
};
