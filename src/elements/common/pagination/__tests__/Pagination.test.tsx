import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import Pagination, { PaginationProps } from '../Pagination';
import { DEFAULT_PAGE_SIZE } from '../../../../constants';

describe('elements/common/pagination/Pagination', () => {
    const renderComponent = (props: Partial<PaginationProps> = {}) => render(<Pagination isSmall={false} {...props} />);

    test('should render MarkerBasedPagination when hasNextMarker or hasPrevMarker is true', async () => {
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
        expect(onMarkerBasedPageChange).toHaveBeenCalled();
        expect(onOffsetChange).not.toHaveBeenCalled();
    });

    test('should render OffsetBasedPagination when hasNextMarker and hasPrevMarker are false', async () => {
        const onMarkerBasedPageChange = jest.fn();
        const onOffsetChange = jest.fn();
        renderComponent({
            hasNextMarker: false,
            hasPrevMarker: false,
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
