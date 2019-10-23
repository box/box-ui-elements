/**
 * @flow
 * @file Function to render the checkbox table cell
 * @author Box
 */

import React from 'react';
import RadioButton from '../../components/radio/RadioButton';
import isRowSelectable from './cellRendererHelper';

export default (
    onItemSelect: Function,
    selectableType: string,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean,
): Function => ({ rowData }: { rowData: BoxItem }) => {
    const { name, selected = false } = rowData;

    if (!isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData)) {
        return <span />;
    }

    return (
        <RadioButton
            hideLabel
            isSelected={selected}
            label={((name: any): string)}
            name={((name: any): string)}
            onChange={() => onItemSelect(rowData)}
        />
    );
};
