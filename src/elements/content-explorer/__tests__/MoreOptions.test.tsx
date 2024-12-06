import * as React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen, fireEvent } from '../../../test-utils/testing-library';
import MoreOptions from '../MoreOptions';
import { TYPE_FILE, TYPE_WEBLINK } from '../../../constants';

const defaultProps = {
    canDelete: true,
    canDownload: true,
    canPreview: true,
    canRename: true,
    canShare: true,
    isSmall: false,
    item: {
        id: '1',
        name: 'Test Item',
        type: TYPE_FILE,
        permissions: {
            can_delete: true,
            can_download: true,
            can_preview: true,
            can_rename: true,
            can_share: true,
        },
    },
    onItemSelect: jest.fn(),
    onItemDelete: jest.fn(),
    onItemDownload: jest.fn(),
    onItemRename: jest.fn(),
    onItemShare: jest.fn(),
    onItemPreview: jest.fn(),
};
describe('elements/content-explorer/MoreOptions', () => {
    const renderComponent = (props = {}) => render(<MoreOptions {...defaultProps} {...props} />);

    test('renders MoreOptions component', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'More options' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
    });

    test('opens MoreOptions dropdown when clicked', async () => {
        renderComponent();
        await userEvent.click(screen.getByRole('button', { name: 'More options' }));

        expect(screen.getByRole('menuitem', { name: 'Preview' })).toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: 'Open' })).not.toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Download' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Share' })).toBeInTheDocument();
    });

    test('opens MoreOptions dropdown when clicked and show Open when item is a weblink', async () => {
        renderComponent({
            item: { ...defaultProps.item, type: TYPE_WEBLINK },
        });
        await userEvent.click(screen.getByRole('button', { name: 'More options' }));

        expect(screen.getByRole('menuitem', { name: 'Open' })).toBeInTheDocument();
    });

    test('calls onItemSelect when focused', () => {
        renderComponent();
        fireEvent.focus(screen.getByRole('button', { name: 'More options' }));
        expect(defaultProps.onItemSelect).toHaveBeenCalledWith(defaultProps.item);
    });

    test('calls onItemDelete when delete option is clicked', async () => {
        const onItemDelete = jest.fn();
        renderComponent({ onItemDelete });
        await userEvent.click(screen.getByRole('button', { name: 'More options' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
        expect(onItemDelete).toHaveBeenCalledWith(defaultProps.item);
    });

    test('calls onItemDownload when download option is clicked', async () => {
        const onItemDownload = jest.fn();
        renderComponent({ onItemDownload });
        await userEvent.click(screen.getByRole('button', { name: 'More options' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Download' }));
        expect(onItemDownload).toHaveBeenCalledWith(defaultProps.item);
    });

    test('calls onItemRename when rename option is clicked', async () => {
        const onItemRename = jest.fn();
        renderComponent({ onItemRename });
        await userEvent.click(screen.getByRole('button', { name: 'More options' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
        expect(onItemRename).toHaveBeenCalledWith(defaultProps.item);
    });

    test('calls onItemShare when share option is clicked', async () => {
        const onItemShare = jest.fn();
        renderComponent({ onItemShare });
        await userEvent.click(screen.getByRole('button', { name: 'More options' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Share' }));
        expect(onItemShare).toHaveBeenCalledWith(defaultProps.item);
    });

    test('calls onItemPreview when preview option is clicked', async () => {
        const onItemPreview = jest.fn();
        renderComponent({ onItemPreview });
        await userEvent.click(screen.getByRole('button', { name: 'More options' }));
        await userEvent.click(screen.getByRole('menuitem', { name: 'Preview' }));
        expect(onItemPreview).toHaveBeenCalledWith(defaultProps.item);
    });

    test('does not render options if type is not file', async () => {
        renderComponent({ item: { ...defaultProps.item, type: 'folder' } });
        await userEvent.click(screen.getByRole('button', { name: 'More options' }));
        expect(screen.queryByRole('menuitem', { name: 'Preview' })).not.toBeInTheDocument();
    });

    test('does not render options if permissions are missing', () => {
        renderComponent({ item: { ...defaultProps.item, permissions: null } });
        expect(screen.queryByRole('button', { name: 'More options' })).not.toBeInTheDocument();
    });

    test('does not render options if all actions are disallowed', () => {
        renderComponent({
            canDelete: false,
            canDownload: false,
            canPreview: false,
            canRename: false,
            canShare: false,
        });

        expect(screen.queryByRole('button', { name: 'More options' })).not.toBeInTheDocument();
    });
});
