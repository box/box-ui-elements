import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import InlineBreadcrumbs, { InlineBreadcrumbsProps } from '../InlineBreadcrumbs';

describe('elements/common/breadcrumbs/InlineBreadcrumbs', () => {
    const renderComponent = (props: Partial<InlineBreadcrumbsProps> = {}) => {
        const item = {
            id: '123',
            name: 'Test Item',
            path_collection: {
                entries: [
                    { id: '0', name: 'All Files' },
                    { id: '1', name: 'Folder 1' },
                ],
            },
        };
        return render(<InlineBreadcrumbs item={item} onItemClick={jest.fn()} rootId={'0'} {...props} />);
    };

    test('should render FormattedMessage and Breadcrumbs components', () => {
        renderComponent();
        expect(screen.getByText('In')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'All Files' })).toBeInTheDocument();
        expect(screen.getByText('/')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Folder 1' })).toBeInTheDocument();
    });

    test('should call onItemClick when a breadcrumb is clicked', async () => {
        const onItemClick = jest.fn();
        renderComponent({ onItemClick });

        const button = screen.getByRole('button', { name: 'All Files' });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);
        expect(onItemClick).toHaveBeenCalledWith('0');
    });

    test('should render dropdown when there are at least 4 crumbs', () => {
        const item = {
            id: '123',
            name: 'Test Item',
            path_collection: {
                entries: [
                    { id: '0', name: 'All Files' },
                    { id: '1', name: 'Folder 1' },
                    { id: '2', name: 'Folder 2' },
                    { id: '3', name: 'Folder 3' },
                ],
            },
        };
        renderComponent({ item });
        expect(screen.getByRole('button', { name: 'Breadcrumb' })).toBeInTheDocument();
    });
});
