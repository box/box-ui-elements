import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
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

    const renderComponent = (props = {}) => render(<Footer {...defaultProps} {...props} />);

    test('should render Footer', () => {
        renderComponent();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
        expect(document.querySelector('.footer-child')).toBeInTheDocument();
        expect(document.querySelector('.btn-group')).toBeInTheDocument(); // ButtonGroup
    });

    test('should render footer with disabled button', () => {
        renderComponent();
        const chooseButton = screen.getByRole('button', { name: 'Choose' });

        // https://www.w3.org/WAI/ARIA/apg/patterns/button/
        // When the action associated with a button is unavailable, the button has aria-disabled set to true.
        expect(chooseButton).toHaveAttribute('aria-disabled', 'true');
        expect(chooseButton).toHaveClass('is-disabled');
    });

    test('should render Footer buttons with aria-label', () => {
        renderComponent();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Choose' })).toBeInTheDocument();
    });

    test('should render Footer with custom action button', () => {
        const renderCustomActionButtons = jest.fn();
        renderComponent({
            renderCustomActionButtons: renderCustomActionButtons.mockReturnValue(
                <div className="custom-button">Custom Button</div>,
            ),
        });

        expect(screen.getByText('Custom Button')).toBeInTheDocument();
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
        renderComponent({ isSingleSelect, showSelectedButton });
        const selectedButton = screen.queryByRole('button', { name: /selected/i });
        expect(!!selectedButton).toBe(shown);
    });
});
