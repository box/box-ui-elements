import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library.tsx';
import Footer from '../Footer';

describe('elements/content-picker/Footer', () => {
    const defaultProps = {
        children: <div className="footer-child" />,
        currentCollection: { id: '123', name: 'Folder' },
        hasHitSelectionLimit: false,
        isSingleSelect: false,
        onCancel: () => {},
        onChoose: () => {},
        onSelectedClick: () => {},
        selectedCount: 0,
        selectedItems: [],
    };

    const renderFooter = props => render(<Footer {...defaultProps} {...props} />);

    describe('render()', () => {
        test('should render Footer', () => {
            const { container } = renderFooter();

            expect(screen.getByRole('contentinfo')).toBeInTheDocument();
            expect(container.querySelector('.footer-child')).toBeInTheDocument();
        });

        test('should render footer with disabled button', () => {
            renderFooter();
            const buttons = screen.getAllByRole('button');
            const chooseButton = buttons[1];

            // https://www.w3.org/WAI/ARIA/apg/patterns/button/
            // When the action associated with a button is unavailable, the button has aria-disabled set to true.
            expect(chooseButton).toHaveAttribute('aria-disabled', 'true');
            expect(chooseButton).toHaveClass('is-disabled');
        });

        test('should render Footer buttons with aria-label', () => {
            renderFooter();
            const buttons = screen.getAllByRole('button');

            expect(buttons[0]).toHaveAttribute('aria-label', 'Cancel');
            expect(buttons[1]).toHaveAttribute('aria-label', 'Choose');
        });

        test('should render Footer with custom action button', () => {
            const renderCustomActionButtons = jest.fn().mockReturnValue(<div data-testid="custom-button" />);

            renderFooter({
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
            ${false}           | ${false}       | ${false} | ${'should not show selected button'}
            ${false}           | ${true}        | ${false} | ${'should not show selected button'}
            ${true}            | ${false}       | ${true}  | ${'should show selected button'}
            ${true}            | ${true}        | ${false} | ${'should not show selected button'}
        `('$should', ({ isSingleSelect, shown, showSelectedButton }) => {
            renderFooter({ isSingleSelect, showSelectedButton });

            const selectedButton = screen.queryByRole('button', { name: /selected/i });
            expect(selectedButton).toEqual(shown ? expect.anything() : null);
        });
    });
});
