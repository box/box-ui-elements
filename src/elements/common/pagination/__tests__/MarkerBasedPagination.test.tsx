import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import MarkerBasedPagination, { MarkerBasedPaginationProps } from '../MarkerBasedPagination';

describe('elements/common/pagination/MarkerBasedPagination', () => {
    const renderComponent = (props: Partial<MarkerBasedPaginationProps>) =>
        render(<MarkerBasedPagination isSmall={false} {...props} />);

    test('should not render pagination controls when both markers are false', () => {
        renderComponent({
            hasNextMarker: false,
            hasPrevMarker: false,
        });

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('should call onMarkerBasedPageChange with correct offset when clicking next', async () => {
        const onMarkerBasedPageChange = jest.fn();
        renderComponent({
            hasNextMarker: true,
            onMarkerBasedPageChange,
        });

        await userEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(onMarkerBasedPageChange).toHaveBeenCalledWith(1);
    });

    test('should call onMarkerBasedPageChange with correct offset when clicking previous', async () => {
        const onMarkerBasedPageChange = jest.fn();
        renderComponent({
            hasPrevMarker: true,
            onMarkerBasedPageChange,
        });

        await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
        expect(onMarkerBasedPageChange).toHaveBeenCalledWith(-1);
    });
});
