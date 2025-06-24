import * as React from 'react';
import { render, screen, userEvent } from '../../../../test-utils/testing-library';
import { BackButton } from '..';

describe('elements/common/back-button/BackButton', () => {
    const mockOnClick = jest.fn();

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    test('should render back button with navigation icon and accessible text', () => {
        render(<BackButton onClick={mockOnClick} />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bdl-BackButton');

        expect(screen.getByText('Back')).toBeInTheDocument();

        const icon = button.querySelector('svg');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('icon-navigate-left');
    });

    test('should call onClick handler when clicked', async () => {
        const user = userEvent();

        render(<BackButton onClick={mockOnClick} />);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('should pass through additional props', () => {
        render(<BackButton onClick={mockOnClick} data-testid="test-back-button" data-resin-target="back" />);

        const button = screen.getByTestId('test-back-button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('data-resin-target', 'back');
    });

    test('should apply custom className alongside default class', () => {
        render(<BackButton onClick={mockOnClick} className="custom-class" />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bdl-BackButton');
        expect(button).toHaveClass('custom-class');
    });
});
