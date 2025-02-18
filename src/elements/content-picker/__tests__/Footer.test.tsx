import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import Footer from '../Footer';
import type { Collection, BoxItem } from '../../../common/types/core';

describe('elements/content-picker/Footer', () => {
    const defaultProps = {
        children: <div className="footer-child" />,
        currentCollection: { id: '123', name: 'Folder' } as Collection,
        hasHitSelectionLimit: false,
        isSingleSelect: false,
        onCancel: jest.fn(),
        onChoose: jest.fn(),
        onSelectedClick: jest.fn(),
        selectedCount: 0,
        selectedItems: [] as BoxItem[],
        showSelectedButton: true,
    };

    const renderComponent = (props = {}) => {
        render(<Footer {...defaultProps} {...props} />);
    };

    test('should render Footer', () => {
        renderComponent();

        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getByTestId('footer-child')).toBeInTheDocument();
        expect(screen.getByRole('group', { name: /actions/i })).toBeInTheDocument();
    });

    test('should render footer with disabled button', () => {
        renderComponent();

        const chooseButton = screen.getByRole('button', { name: /choose/i });
        expect(chooseButton).toHaveAttribute('aria-disabled', 'true');
        expect(chooseButton).toBeDisabled();
    });

    test('should render Footer buttons with aria-label', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /choose/i })).toBeInTheDocument();
    });

    test('should render Footer with custom action button', () => {
        const renderCustomActionButtons = jest.fn().mockReturnValue(<div data-testid="custom-button" />);

        renderComponent({
            renderCustomActionButtons,
        });

        expect(screen.getByTestId('custom-button')).toBeInTheDocument();
        expect(renderCustomActionButtons).toHaveBeenCalledWith({
            currentFolderId: defaultProps.currentCollection.id,
            currentFolderName: defaultProps.currentCollection.name,
            onCancel: defaultProps.onCancel,
            onChoose: defaultProps.onChoose,
            selectedCount: defaultProps.selectedCount,
            selectedItems: defaultProps.selectedItems,
        });
    });

    test.each`
        showSelectedButton | isSingleSelect | shown    | should
        ${false}          | ${false}       | ${false} | ${'should not show selected button'}
        ${false}          | ${true}        | ${false} | ${'should not show selected button'}
        ${true}           | ${false}       | ${true}  | ${'should show selected button'}
        ${true}           | ${true}        | ${false} | ${'should not show selected button'}
    `('$should', ({ isSingleSelect, shown, showSelectedButton }) => {
        renderComponent({ isSingleSelect, showSelectedButton });

        const selectedButton = screen.queryByRole('button', { name: /selected/i });
        expect(!!selectedButton).toBe(shown);
    });
});
