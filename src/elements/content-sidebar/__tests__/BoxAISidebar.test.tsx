import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { screen, render } from '../../../test-utils/testing-library';
import BoxAISidebarComponent, { BoxAISidebarProps } from '../BoxAISidebar';

const mockOnExpandClick = jest.fn();

describe('elements/content-sidebar/BoxAISidebar', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            onExpandClick: mockOnExpandClick,
        } satisfies BoxAISidebarProps;

        render(<BoxAISidebarComponent {...defaultProps} {...props} />);
    };

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Box AI' })).toBeInTheDocument();
    });

    test('should have accessible "Expand" button', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
    });

    test('should call onExpandClick when click "Expand" button', async () => {
        renderComponent();

        const expandButton = screen.getByRole('button', { name: 'Expand' });
        await userEvent.click(expandButton);

        expect(mockOnExpandClick).toHaveBeenCalled();
    });
});
