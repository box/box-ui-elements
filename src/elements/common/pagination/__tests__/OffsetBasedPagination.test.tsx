import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import OffsetBasedPagination, { OffsetBasedPaginationProps } from '../OffsetBasedPagination';
import { DEFAULT_PAGE_SIZE } from '../../../../constants';

describe('elements/common/pagination/OffsetBasedPagination', () => {
    const renderComponent = (props: Partial<OffsetBasedPaginationProps>) =>
        render(<OffsetBasedPagination isSmall={false} {...props} />);

    test('should not render pagination controls when pageCount is less than or equal to 1', () => {
        renderComponent({
            totalCount: DEFAULT_PAGE_SIZE,
        });

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('should render pagination controls when pageCount is greater than 1', () => {
        renderComponent({
            totalCount: DEFAULT_PAGE_SIZE + 1,
        });

        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    });

    test('should call onOffsetChange with correct offset when clicking next', async () => {
        const onOffsetChange = jest.fn();
        renderComponent({
            offset: 0,
            pageSize: 10,
            totalCount: 30,
            onOffsetChange,
        });

        await userEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(onOffsetChange).toHaveBeenCalledWith(10);
    });

    test('should call onOffsetChange with correct offset when clicking previous', async () => {
        const onOffsetChange = jest.fn();
        renderComponent({
            offset: 10,
            pageSize: 10,
            totalCount: 30,
            onOffsetChange,
        });

        await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
        expect(onOffsetChange).toHaveBeenCalledWith(0);
    });

    test('should disable previous button on first page', () => {
        renderComponent({
            offset: 0,
            pageSize: 10,
            totalCount: 30,
        });

        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();
    });

    test('should disable next button on last page', () => {
        renderComponent({
            offset: 20,
            pageSize: 10,
            totalCount: 30,
        });

        expect(screen.getByRole('button', { name: 'Previous' })).not.toBeDisabled();
        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });
});
