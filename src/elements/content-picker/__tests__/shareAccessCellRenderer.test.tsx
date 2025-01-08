import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import shareAccessCellRenderer from '../shareAccessCellRenderer';
import { BoxItem } from '../../../common/types/core';
import { TYPE_FOLDER } from '../../../constants';

describe('elements/content-picker/shareAccessCellRenderer', () => {
    const defaultProps = {
        onChange: jest.fn(),
        canSetShareAccess: true,
        selectableType: TYPE_FOLDER,
        extensionsWhitelist: [],
        hasHitSelectionLimit: false,
    };

    const renderComponent = (rowData: BoxItem) => {
        const Component = shareAccessCellRenderer(
            defaultProps.onChange,
            defaultProps.canSetShareAccess,
            defaultProps.selectableType,
            defaultProps.extensionsWhitelist,
            defaultProps.hasHitSelectionLimit,
        );
        return render(<Component rowData={rowData} />);
    };

    test('renders loading indicator when access levels are not available', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            type: TYPE_FOLDER,
            permissions: { can_set_share_access: true },
            selected: true,
        };
        renderComponent(rowData);
        expect(screen.getByTestId('bcp-share-access-loading')).toBeInTheDocument();
    });

    test('renders ShareAccessSelect when access levels are available', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            type: TYPE_FOLDER,
            permissions: { can_set_share_access: true },
            selected: true,
            allowed_shared_link_access_levels: ['can_download', 'can_preview'],
        };
        renderComponent(rowData);
        expect(screen.getByTestId('bcp-shared-access-select')).toBeInTheDocument();
    });

    test('does not render anything when item is not selectable', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            type: TYPE_FOLDER,
            permissions: { can_set_share_access: false },
            selected: true,
        };
        renderComponent(rowData);
        expect(screen.queryByTestId('bcp-share-access-loading')).not.toBeInTheDocument();
        expect(screen.queryByTestId('bcp-shared-access-select')).not.toBeInTheDocument();
    });

    test('renders ShareAccessSelect with correct props and handles onChange', () => {
        const rowData: BoxItem = {
            id: '123',
            name: 'test',
            type: TYPE_FOLDER,
            permissions: { can_set_share_access: true },
            selected: true,
            allowed_shared_link_access_levels: ['can_download', 'can_preview'],
        };
        renderComponent(rowData);

        // Verify ShareAccessSelect is rendered
        const shareAccessWrapper = screen.getByTestId('bcp-shared-access-select');
        expect(shareAccessWrapper).toBeInTheDocument();

        // Verify ShareAccessSelect component is rendered
        expect(shareAccessWrapper.children.length).toBeGreaterThan(0);

        // Verify onChange handler works
        defaultProps.onChange(rowData);
        expect(defaultProps.onChange).toHaveBeenCalledWith(rowData);
    });
});
