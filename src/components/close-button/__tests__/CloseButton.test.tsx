import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import CloseButton from '../CloseButton';

describe('components/close-button/CloseButton', () => {
    describe('render()', () => {
        test('should correctly render', () => {
            render(<CloseButton />);

            const closeButton = screen.getByRole('button');

            expect(closeButton).toHaveAttribute('type', 'button');
            expect(closeButton).toHaveClass('bdl-CloseButton');
        });

        test('should have custom className', () => {
            const customClass = 'custom-class';
            render(<CloseButton className={customClass} />);

            const closeButton = screen.getByRole('button');
            expect(closeButton).toHaveClass(customClass);
            expect(closeButton).toHaveClass('bdl-CloseButton');
        });
    });

    describe('onClick()', () => {
        test('should call custom handler when clicked', () => {
            const handleClick = jest.fn();
            render(<CloseButton onClick={handleClick} />);

            const closeButton = screen.getByRole('button');

            fireEvent.click(closeButton);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });
});
