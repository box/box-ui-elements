/**
 * @flow strict
 * @file Function to render the checkbox or radio table cell
 * @author Box
 */

import React from 'react';
import Checkbox from '../../components/checkbox';
import RadioButton from '../../components/radio/RadioButton';
import isRowSelectable from './cellRendererHelper';
import { isSelected as isRowSelected } from './itemSelectionHelper';

export default (
    onItemSelect: (rowData: BoxItem) => {},
    selectableType: string,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean,
    isRadio: boolean,
    selected: Array<BoxItem>,
): (({ rowData: BoxItem }) => {}) => ({ rowData }: { rowData: BoxItem }) => {
    const { name = '' } = rowData;
    const Component = isRadio ? RadioButton : Checkbox;
    const isSelected = !!isRowSelected(rowData, selected);

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
