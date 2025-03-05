import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import PaginationControls, { PaginationControlsProps } from '../PaginationControls';

describe('elements/common/pagination/PaginationControls', () => {
    const defaultProps = {
        handleNextClick: jest.fn(),
        handlePreviousClick: jest.fn(),
        hasNextPage: true,
        hasPreviousPage: true,
        isSmall: false,
    };

    const renderComponent = (props: Partial<PaginationControlsProps>) =>
        render(<PaginationControls {...defaultProps} {...props} />);

    test('should render pagination controls correctly', () => {
        renderComponent({});

        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    });

    test('should call handleNextClick when next button is clicked', async () => {
        const handleNextClick = jest.fn();
        renderComponent({ handleNextClick });

        await userEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(handleNextClick).toHaveBeenCalledTimes(1);
    });

    test('should call handlePreviousClick when previous button is clicked', async () => {
        const handlePreviousClick = jest.fn();
        renderComponent({ handlePreviousClick });

        await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
        expect(handlePreviousClick).toHaveBeenCalledTimes(1);
    });

    test('should disable previous button when hasPreviousPage is false', () => {
        renderComponent({ hasPreviousPage: false });

        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    });

    test('should disable next button when hasNextPage is false', () => {
        renderComponent({ hasNextPage: false });

        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    test('should render small pagination controls when isSmall is true', () => {
        renderComponent({ isSmall: true });

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toHaveClass('bdl-Pagination-iconButton');
        expect(buttons[1]).toHaveClass('bdl-Pagination-iconButton');
    });

    test('should display offset-based pagination status when isOffsetBasedPagination is true', () => {
        renderComponent({
            isOffsetBasedPagination: true,
            offset: 0,
            pageSize: 10,
            totalCount: 30,
        });

        expect(screen.getByText(/Showing 1 to 10 of 30 entries/i)).toBeInTheDocument();
    });

    test('should not display pagination status when isOffsetBasedPagination is false', () => {
        renderComponent({
            isOffsetBasedPagination: false,
            offset: 0,
            pageSize: 10,
            totalCount: 30,
        });

        expect(screen.queryByText(/Showing 1 to 10 of 30 entries/i)).not.toBeInTheDocument();
    });
});
