import * as React from 'react';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';

import ItemRemove, { ItemRemoveProps } from '../ItemRemove';

import { STATUS_IN_PROGRESS, STATUS_STAGED } from '../../../constants';

describe('elements/content-uploader/ItemRemove', () => {
    const renderComponent = (props: Partial<ItemRemoveProps>) =>
        render(<ItemRemove onClick={jest.fn()} status={STATUS_IN_PROGRESS} {...props} />);

    test('should have aria-label "Remove" and no aria-describedby', () => {
        renderComponent({});
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Remove');
        expect(button).not.toHaveAttribute('aria-describedby');
    });

    test('should render disabled button when status is STATUS_STAGED', () => {
        renderComponent({ status: STATUS_STAGED });
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    test('should call onClick when button is clicked', () => {
        const mockOnClick = jest.fn();
        renderComponent({ onClick: mockOnClick });

        fireEvent.click(screen.getByRole('button'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
