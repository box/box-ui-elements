import * as React from 'react';
import '@testing-library/jest-dom';
import { screen, render } from '../../../test-utils/testing-library';
import type { FooterProps } from '../Footer';
import Footer from '../Footer';

describe('elements/content-picker/Footer', () => {
    const defaultProps: FooterProps = {
        children: <div data-testid="footer-child" className="footer-child" />,
        currentCollection: { id: '123', name: 'Folder' },
        hasHitSelectionLimit: false,
        isSingleSelect: false,
        onCancel: jest.fn(),
        onChoose: jest.fn(),
        onSelectedClick: jest.fn(),
        selectedCount: 0,
        selectedItems: [],
        showSelectedButton: false,
    };

    const renderComponent = (props: Partial<FooterProps> = {}) => render(<Footer {...defaultProps} {...props} />);

    describe('render()', () => {
        test('should render Footer with basic elements', () => {
            renderComponent();

            const footer = screen.getByRole('contentinfo');
            const child = screen.getByTestId('footer-child');

            expect(footer).toBeInTheDocument();
            expect(footer).toHaveClass('bcp-footer');
            expect(child).toBeInTheDocument();
        });

        test('should render footer with disabled choose button', () => {
            renderComponent();

            const chooseButton = screen.getByRole('button', { name: 'Choose' });
            expect(chooseButton).toBeDisabled();
            expect(chooseButton).toHaveAttribute('aria-disabled', 'true');
        });

        test('should render Footer buttons with correct aria-labels', () => {
            renderComponent();

            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Choose' })).toBeInTheDocument();
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
            showSelectedButton | isSingleSelect | shown    | description
            ${false}           | ${false}       | ${false} | ${'should not show selected button when showSelectedButton is false'}
            ${false}           | ${true}        | ${false} | ${'should not show selected button when isSingleSelect is true'}
            ${true}            | ${false}       | ${true}  | ${'should show selected button when conditions are met'}
            ${true}            | ${true}        | ${false} | ${'should not show selected button when isSingleSelect is true regardless of showSelectedButton'}
        `('$description', ({ isSingleSelect, shown, showSelectedButton }) => {
            renderComponent({ isSingleSelect, showSelectedButton });

            const selectedButton = screen.queryByRole('button', { name: /selected/i });
            if (shown) {
                expect(selectedButton).toBeInTheDocument();
            } else {
                expect(selectedButton).not.toBeInTheDocument();
            }
        });

        test('should call onCancel when cancel button is clicked', () => {
            const onCancel = jest.fn();
            renderComponent({ onCancel });

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            cancelButton.click();

            expect(onCancel).toHaveBeenCalled();
        });

        test('should call onChoose when choose button is clicked and items are selected', () => {
            const onChoose = jest.fn();
            renderComponent({ onChoose, selectedCount: 2 });

            const chooseButton = screen.getByRole('button', { name: 'Choose' });
            chooseButton.click();

            expect(onChoose).toHaveBeenCalled();
        });

        test('should call onSelectedClick when selected button is clicked', () => {
            const onSelectedClick = jest.fn();
            renderComponent({ onSelectedClick, showSelectedButton: true });

            const selectedButton = screen.getByRole('button', { name: /selected/i });
            selectedButton.click();

            expect(onSelectedClick).toHaveBeenCalled();
        });

        test('should render custom button labels when provided', () => {
            renderComponent({
                cancelButtonLabel: 'Custom Cancel',
                chooseButtonLabel: 'Custom Choose',
            });

            expect(screen.getByRole('button', { name: 'Custom Cancel' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Custom Choose' })).toBeInTheDocument();
        });

        test('should show selection limit message when hasHitSelectionLimit is true', () => {
            renderComponent({
                hasHitSelectionLimit: true,
                selectedCount: 3,
                showSelectedButton: true,
            });

            const selectedButton = screen.getByRole('button', { name: /selected.*max/i });
            expect(selectedButton).toBeInTheDocument();
            expect(selectedButton).toHaveTextContent(/3.*selected.*max/i);
        });
    });
});
