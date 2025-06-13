import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackButton } from '..';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
}));

describe('elements/common/nav-button/BackButton', () => {
    const mockOnClick = jest.fn();
    let user;

    beforeEach(() => {
        mockOnClick.mockClear();
        user = userEvent.setup();
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
        const customOnClick = jest.fn();

        render(<BackButton onClick={customOnClick} />);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(customOnClick).toHaveBeenCalledTimes(1);
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
