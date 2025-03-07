import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import Pagination, { PaginationProps } from '../Pagination';
import { DEFAULT_PAGE_SIZE } from '../../../../constants';

describe('elements/common/pagination/Pagination', () => {
    const renderComponent = (props: Partial<PaginationProps> = {}) => render(<Pagination isSmall={false} {...props} />);

    test('should render MarkerBasedPagination when only hasPrevMarker is true', async () => {
        const onMarkerBasedPageChange = jest.fn();
        const onOffsetChange = jest.fn();
        renderComponent({
            hasPrevMarker: true,
            onMarkerBasedPageChange,
            onOffsetChange,
        });

        const previousButton = screen.getByRole('button', { name: 'Previous' });
        const nextButton = screen.getByRole('button', { name: 'Next' });
        expect(previousButton).not.toBeDisabled();
        expect(nextButton).toBeDisabled();

        await userEvent.click(previousButton);
        expect(onMarkerBasedPageChange).toHaveBeenCalledWith(-1);
        expect(onOffsetChange).not.toHaveBeenCalled();
    });

    test('should render MarkerBasedPagination when only hasNextMarker is true', async () => {
        const onMarkerBasedPageChange = jest.fn();
        const onOffsetChange = jest.fn();
        renderComponent({
            hasNextMarker: true,
            onMarkerBasedPageChange,
            onOffsetChange,
        });

        const previousButton = screen.getByRole('button', { name: 'Previous' });
        const nextButton = screen.getByRole('button', { name: 'Next' });
        expect(previousButton).toBeDisabled();
        expect(nextButton).not.toBeDisabled();

        await userEvent.click(nextButton);
        expect(onMarkerBasedPageChange).toHaveBeenCalledWith(1);
        expect(onOffsetChange).not.toHaveBeenCalled();
    });

    test('should render MarkerBasedPagination when both hasNextMarker and hasPrevMarker are true', async () => {
        const onMarkerBasedPageChange = jest.fn();
        const onOffsetChange = jest.fn();
        renderComponent({
            hasNextMarker: true,
            hasPrevMarker: true,
            onMarkerBasedPageChange,
            onOffsetChange,
        });

        const previousButton = screen.getByRole('button', { name: 'Previous' });
        const nextButton = screen.getByRole('button', { name: 'Next' });
        expect(previousButton).not.toBeDisabled();
        expect(nextButton).not.toBeDisabled();

        await userEvent.click(nextButton);
        expect(onMarkerBasedPageChange).toHaveBeenCalledWith(1);
        expect(onOffsetChange).not.toHaveBeenCalled();

        await userEvent.click(previousButton);
        expect(onMarkerBasedPageChange).toHaveBeenCalledWith(-1);
        expect(onOffsetChange).not.toHaveBeenCalled();
    });

    test('should render OffsetBasedPagination when both hasNextMarker and hasPrevMarker are set to false by default', async () => {
        const onMarkerBasedPageChange = jest.fn();
        const onOffsetChange = jest.fn();
        renderComponent({
            totalCount: DEFAULT_PAGE_SIZE + 1,
            onMarkerBasedPageChange,
            onOffsetChange,
        });

        const nextButton = screen.queryByRole('button', { name: 'Next' });
        expect(nextButton).not.toBeDisabled();

        await userEvent.click(nextButton);
        expect(onMarkerBasedPageChange).not.toHaveBeenCalled();
        expect(onOffsetChange).toHaveBeenCalled();
    });
});
