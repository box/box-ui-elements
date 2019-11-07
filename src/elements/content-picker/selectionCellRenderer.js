/**
 * @flow strict
 * @file Function to render the checkbox or radio table cell
 * @author Box
 */

import React from 'react';
import Checkbox from '../../components/checkbox';
import RadioButton from '../../components/radio/RadioButton';
import isRowSelectable from './cellRendererHelper';

export default (
    onItemSelect: (rowData: BoxItem) => {},
    selectableType: string,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean,
    isRadio: boolean,
    selected: Array<BoxItem>,
): (({ rowData: BoxItem }) => {}) => ({ rowData }: { rowData: BoxItem }) => {
    const { name = '', id, type } = rowData;
    const Component = isRadio ? RadioButton : Checkbox;
    const isSelected = !!selected.find(sel => sel.id === id && sel.type === type);

    if (!isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData, isSelected)) {
        return <span />;
    }

    return (
        <Component
            hideLabel
            label={name}
            name={name}
            onChange={() => onItemSelect(rowData)}
            value={name}
            {...{ [isRadio ? 'isSelected' : 'isChecked']: isSelected }}
        />
    );
};
