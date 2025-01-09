import * as React from 'react';
import '@testing-library/jest-dom';
import { screen, render } from '../../../test-utils/testing-library';
import Footer from '../Footer';

describe('elements/content-picker/Footer', () => {
    const defaultProps = {
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

    const renderComponent = (props = {}) => render(<Footer {...defaultProps} {...props} />);

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

        test.each([
            {
                showSelectedButton: false,
                isSingleSelect: false,
                shown: false,
                description: 'should not show selected button when showSelectedButton is false',
            },
            {
                showSelectedButton: false,
                isSingleSelect: true,
                shown: false,
                description: 'should not show selected button when isSingleSelect is true',
            },
            {
                showSelectedButton: true,
                isSingleSelect: false,
                shown: true,
                description: 'should show selected button when conditions are met',
            },
            {
                showSelectedButton: true,
                isSingleSelect: true,
                shown: false,
                description:
                    'should not show selected button when isSingleSelect is true regardless of showSelectedButton',
            },
        ])('$description', ({ isSingleSelect, shown, showSelectedButton }) => {
            renderComponent({ isSingleSelect, showSelectedButton });

            const selectedButton = screen.queryByRole('button', { name: /selected/i });
            if (shown) {
                expect(selectedButton).toBeInTheDocument();
            } else {
                expect(selectedButton).not.toBeInTheDocument();
            }
        });
    });
});
