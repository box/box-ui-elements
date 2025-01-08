import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import checkboxCellRenderer from '../checkboxCellRenderer';
import { BoxItem } from '../../../common/types/core';
import { TYPE_FOLDER } from '../../../constants';

describe('elements/content-picker/checkboxCellRenderer', () => {
    const defaultProps = {
        onItemSelect: jest.fn(),
        selectableType: TYPE_FOLDER,
        extensionsWhitelist: [],
        hasHitSelectionLimit: false,
    };

    const renderComponent = (rowData: BoxItem) => {
        const Component = checkboxCellRenderer(
            defaultProps.onItemSelect,
            defaultProps.selectableType,
            defaultProps.extensionsWhitelist,
            defaultProps.hasHitSelectionLimit,
        );
        return render(<Component rowData={rowData} />);
    };

    test('renders checkbox for selectable item', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            type: TYPE_FOLDER,
            selected: false,
        };
        renderComponent(rowData);
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    test('renders checkbox with correct checked state', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            type: TYPE_FOLDER,
            selected: true,
        };
        renderComponent(rowData);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('calls onItemSelect when checkbox is clicked', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            type: TYPE_FOLDER,
            selected: false,
        };
        renderComponent(rowData);
        screen.getByRole('checkbox').click();
        expect(defaultProps.onItemSelect).toHaveBeenCalledWith(rowData);
    });

    test('does not render checkbox for non-selectable item', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            type: TYPE_FOLDER,
            selected: false,
        };
        renderComponent({
            ...rowData,
            type: 'file', // Non-matching type
        });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    test('does not render checkbox when selection limit is reached for unselected item', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            type: TYPE_FOLDER,
            selected: false,
        };
        const Component = checkboxCellRenderer(
            defaultProps.onItemSelect,
            defaultProps.selectableType,
            defaultProps.extensionsWhitelist,
            true, // hasHitSelectionLimit
        );
        render(<Component rowData={rowData} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
});
