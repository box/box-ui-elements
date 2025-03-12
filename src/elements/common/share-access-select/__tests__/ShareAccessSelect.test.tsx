import React from 'react';
import { screen, render, fireEvent } from '../../../../test-utils/testing-library';
import ShareAccessSelect from '../ShareAccessSelect';
import { ACCESS_NONE, ACCESS_OPEN, ACCESS_COLLAB, ACCESS_COMPANY } from '../../../../constants';

describe('elements/common/share-access-select/ShareAccessSelect', () => {
    const getDefaultItem = (overrides = {}) => ({
        allowed_shared_link_access_levels: [ACCESS_OPEN, ACCESS_COLLAB, ACCESS_COMPANY],
        permissions: {
            can_set_share_access: true,
        },
        shared_link: {
            access: ACCESS_NONE,
        },
        ...overrides,
    });

    const defaultProps = {
        canSetShareAccess: true,
        className: 'test-share-access',
        item: getDefaultItem(),
        onChange: jest.fn(),
    };

    const renderComponent = (props = {}) => {
        return render(<ShareAccessSelect {...defaultProps} {...props} />);
    };

    test('should render select with all options when all access levels are allowed', () => {
        renderComponent();

        const select = screen.getByRole('combobox');
        expect(select).toHaveClass('be-share-access-select test-share-access');

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(4); // Open, Collab, Company, and None
        expect(options[0]).toHaveValue(ACCESS_OPEN);
        expect(screen.getByText('Access: People with the link')).toBeInTheDocument();
        expect(options[1]).toHaveValue(ACCESS_COLLAB);
        expect(screen.getByText('Access: People in this folder')).toBeInTheDocument();
        expect(options[2]).toHaveValue(ACCESS_COMPANY);
        expect(screen.getByText('People in this company')).toBeInTheDocument();
        expect(options[3]).toHaveValue(ACCESS_NONE);
        expect(screen.getByText('No shared link')).toBeInTheDocument();
    });

    test('should render only allowed access level options', () => {
        const item = getDefaultItem({
            allowed_shared_link_access_levels: [ACCESS_OPEN, ACCESS_COMPANY],
        });
        renderComponent({ item });

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3); // Open, Company, and None
        expect(options[0]).toHaveValue(ACCESS_OPEN);
        expect(screen.getByText('Access: People with the link')).toBeInTheDocument();
        expect(options[1]).toHaveValue(ACCESS_COMPANY);
        expect(screen.getByText('People in this company')).toBeInTheDocument();
        expect(options[2]).toHaveValue(ACCESS_NONE);
        expect(screen.getByText('No shared link')).toBeInTheDocument();
    });

    test('should not render select when canSetShareAccess is false', () => {
        renderComponent({ canSetShareAccess: false });
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test('should not render select when can_set_share_access permission is false', () => {
        const item = getDefaultItem({
            permissions: { can_set_share_access: false },
        });
        renderComponent({ item });
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test('should not render select when no allowed_shared_link_access_levels', () => {
        const item = getDefaultItem({
            allowed_shared_link_access_levels: null,
        });
        renderComponent({ item });
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test('should call onChange with selected value and item when selection changes', () => {
        const onChange = jest.fn();
        renderComponent({ onChange });

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: ACCESS_OPEN } });

        expect(onChange).toHaveBeenCalledWith(ACCESS_OPEN, defaultProps.item);
    });

    test('should show "Remove" text for ACCESS_NONE option when current access is not ACCESS_NONE', () => {
        const item = getDefaultItem({
            shared_link: { access: ACCESS_OPEN },
        });
        renderComponent({ item });

        const noneOption = screen.getByRole('option', { name: 'Remove shared link' });
        expect(noneOption).toBeInTheDocument();
    });

    test('should show "None" text for ACCESS_NONE option when current access is ACCESS_NONE', () => {
        renderComponent();

        const noneOption = screen.getByRole('option', { name: 'No shared link' });
        expect(noneOption).toBeInTheDocument();
    });
});
