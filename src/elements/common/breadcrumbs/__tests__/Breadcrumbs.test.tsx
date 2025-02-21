import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import '@testing-library/jest-dom';
import Breadcrumbs from '../Breadcrumbs';
import type { Crumb } from '../../../../common/types/core';

describe('elements/common/breadcrumbs/Breadcrumbs', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            crumbs: [{ id: '0', name: 'All Files' }] as Crumb[],
            delimiter: 'caret' as const,
            onCrumbClick: jest.fn(),
            rootId: '123123',
        };
        render(<Breadcrumbs {...defaultProps} {...props} />);
    };

    test('should render "All Files" breadcrumb', () => {
        renderComponent();
        expect(screen.getByRole('button', { name: 'All Files' })).toBeInTheDocument();
    });

    test('should render dropdown when there are multiple crumbs', () => {
        const crumbs = [
            { id: '0', name: 'All Files' },
            { id: '1', name: 'Folder 1' },
        ] as Crumb[];
        renderComponent({ crumbs });
        expect(screen.getByRole('button', { name: 'More breadcrumb items' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Folder 1' })).toBeInTheDocument();
    });

    test('should call onCrumbClick when clicking a breadcrumb', () => {
        const onCrumbClick = jest.fn();
        const crumbs = [{ id: '0', name: 'All Files' }] as Crumb[];
        renderComponent({ crumbs, onCrumbClick });
        screen.getByRole('button', { name: 'All Files' }).click();
        expect(onCrumbClick).toHaveBeenCalledWith(crumbs[0]);
    });
});
