/**
 * @file Function to render the checkbox table cell
 * @author Box
 */

import * as React from 'react';
import Checkbox from '../../components/checkbox/Checkbox';
import isRowSelectable from './cellRendererHelper';
import { BoxItem } from '../../common/types/core';

interface CheckboxCellRendererProps {
    rowData: BoxItem;
}

type CheckboxCellRenderer = (props: CheckboxCellRendererProps) => JSX.Element;

export default (
        onItemSelect: (item: BoxItem) => void,
        selectableType: string,
        extensionsWhitelist: string[],
        hasHitSelectionLimit: boolean,
    ): CheckboxCellRenderer =>
    ({ rowData }: CheckboxCellRendererProps) => {
        const { name, selected = false } = rowData;

        if (!isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData)) {
            return <span />;
        }

        return (
            <Checkbox
                hideLabel
                isChecked={selected}
                label={name as string}
                name={name as string}
                onChange={() => onItemSelect(rowData)}
            />
        );
    };
