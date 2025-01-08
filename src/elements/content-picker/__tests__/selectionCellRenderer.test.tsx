import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import selectionCellRenderer from '../selectionCellRenderer';
import { BoxItem } from '../../../common/types/core';
import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';

describe('elements/content-picker/selectionCellRenderer', () => {
    const defaultProps = {
        onItemSelect: jest.fn(),
        selectableType: TYPE_FILE,
        extensionsWhitelist: [],
        hasHitSelectionLimit: false,
    };

    const renderComponent = (rowData: BoxItem, isRadio = false) => {
        const Component = selectionCellRenderer(
            defaultProps.onItemSelect,
            defaultProps.selectableType,
            defaultProps.extensionsWhitelist,
            defaultProps.hasHitSelectionLimit,
            isRadio,
        );
        return render(<Component rowData={rowData} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        ['checkbox', false],
        ['radio', true],
    ])('should render %s input when isRadio is %s', (type, isRadio) => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            selected: true,
            type: TYPE_FILE,
        };
        renderComponent(rowData, isRadio);
        expect(screen.getByRole(type)).toBeInTheDocument();
    });

    test.each([
        ['checkbox', false],
        ['radio', true],
    ])('should set checked state correctly for %s when isRadio is %s', (type, isRadio) => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            selected: true,
            type: TYPE_FILE,
        };
        renderComponent(rowData, isRadio);
        const input = screen.getByRole(type);
        expect(input).toBeChecked();
    });

    test('should call onItemSelect when input is clicked', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            selected: false,
            type: TYPE_FILE,
        };
        renderComponent(rowData, false);
        screen.getByRole('checkbox').click();
        expect(defaultProps.onItemSelect).toHaveBeenCalledWith(rowData);
    });

    test('should not render input when item type does not match selectableType', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            selected: false,
            type: TYPE_FOLDER,
        };
        renderComponent(rowData, false);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    test('should not render input when selection limit is reached for unselected item', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            selected: false,
            type: TYPE_FILE,
        };
        const Component = selectionCellRenderer(
            defaultProps.onItemSelect,
            defaultProps.selectableType,
            defaultProps.extensionsWhitelist,
            true, // hasHitSelectionLimit
            false,
        );
        render(<Component rowData={rowData} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    test('should render input with correct name and label', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test-file',
            selected: false,
            type: TYPE_FILE,
        };
        renderComponent(rowData, false);
        const input = screen.getByRole('checkbox');
        expect(input).toHaveAttribute('name', 'test-file');
        expect(input).toHaveAttribute('aria-label', 'test-file');
    });
});
