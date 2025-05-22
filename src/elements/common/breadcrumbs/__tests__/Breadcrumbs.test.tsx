import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';
import Breadcrumbs, { BreadcrumbsProps } from '../Breadcrumbs';

describe('Breadcrumbs', () => {
    const renderComponent = (props: Partial<BreadcrumbsProps> = {}) => {
        const defaultProps = {
            crumbs: [{ id: '0', name: 'All Files' }],
            delimiter: 'caret',
            onCrumbClick: jest.fn(),
            rootId: '123123',
        };
        return render(<Breadcrumbs {...defaultProps} {...props} />);
    };

    test('should render "All Files" breadcrumb in localized string', () => {
        renderComponent();
        const breadCrumb = screen.getByRole('button', { name: 'All Files' });
        expect(breadCrumb).toBeInTheDocument();
    });

    test('should render dropdown when there are at least 4 crumbs', () => {
        const crumbs = [
            { id: '0', name: 'All Files' },
            { id: '1', name: 'Folder 1' },
            { id: '2', name: 'Folder 2' },
            { id: '2', name: 'Folder 3' },
        ];
        renderComponent({ crumbs });
        expect(screen.getByRole('button', { name: 'Breadcrumb' })).toBeInTheDocument();
    });

    test('should call onCrumbClick when clicking a breadcrumb', async () => {
        const onCrumbClick = jest.fn();
        renderComponent({ onCrumbClick });

        const button = screen.getByRole('button', { name: 'All Files' });
        await userEvent.click(button);
        expect(onCrumbClick).toHaveBeenCalledWith('0');
    });
});
