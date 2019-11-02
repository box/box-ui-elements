/**
 * @flow
 * @file Function to render the checkbox table cell
 * @author Box
 */

import React from 'react';
import Checkbox from '../../components/checkbox';
import RadioButton from '../../components/radio/RadioButton';
import isRowSelectable from './cellRendererHelper';

export default (
    onItemSelect: Function,
    selectableType: string,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean,
    isRadio: boolean,
): Function => ({ rowData }: { rowData: BoxItem }) => {
    const { name, selected = false } = rowData;
    const Component = isRadio ? RadioButton : Checkbox;
    const props = {
        [isRadio ? 'isSelected' : 'isChecked']: selected,
        hideLabel: true,
        label: ((name: any): string),
        name: ((name: any): string),
        onChange: () => onItemSelect(rowData),
        value: ((name: any): string),
    };

    if (!isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData)) {
        return <span />;
    }

    return <Component {...props} />;
};
