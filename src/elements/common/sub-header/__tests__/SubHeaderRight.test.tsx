import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import SubHeaderRight, { SubHeaderRightProps } from '../SubHeaderRight';
import { VIEW_FOLDER, VIEW_MODE_GRID } from '../../../../constants';

describe('elements/common/sub-header/SubHeaderRight', () => {
    describe('elements/common/sub-header/SubHeaderRight', () => {
        const defaultProps = {
            canCreateNewFolder: false,
            canUpload: false,
            currentCollection: { items: [] },
            gridColumnCount: 0,
            gridMaxColumns: 5,
            gridMinColumns: 1,
            maxGridColumnCountForWidth: 5,
            onCreate: jest.fn(),
            onGridViewSliderChange: jest.fn(),
            onSortChange: jest.fn(),
            onUpload: jest.fn(),
            onViewModeChange: jest.fn(),
            view: VIEW_FOLDER,
            viewMode: VIEW_MODE_GRID,
        };

        const renderComponent = (props: Partial<SubHeaderRightProps> = {}) =>
            render(<SubHeaderRight {...defaultProps} {...props} />);

        test('should render GridViewSlider when there are items and viewMode is grid', () => {
            renderComponent({
                ...defaultProps,
                currentCollection: { items: [{ id: '1' }] },
                gridColumnCount: 3,
            });
            expect(screen.getByRole('button', { name: 'Decrease column size' })).toBeInTheDocument();
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Increase column size' })).toBeInTheDocument();
        });

        test('should not render GridViewSlider when there are no items', () => {
            renderComponent(defaultProps);
            expect(screen.queryByRole('button', { name: 'Decrease column size' })).not.toBeInTheDocument();
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Increase column size' })).not.toBeInTheDocument();
        });

        test('should render ViewModeChangeButton when there are items and hasGridView', () => {
            renderComponent({
                ...defaultProps,
                currentCollection: { items: [{ id: '1' }] },
                gridColumnCount: 3,
            });
            expect(screen.getByTestId('view-mode-change-button')).toBeInTheDocument();
        });

        test('should not render ViewModeChangeButton when there are no items', () => {
            renderComponent(defaultProps);
            expect(screen.queryByTestId('view-mode-change-button')).not.toBeInTheDocument();
        });

        test('should render Sort when showSort is true', () => {
            renderComponent({
                ...defaultProps,
                currentCollection: { items: [{ id: '1' }] },
            });
            expect(screen.getByRole('button', { name: 'Sort' })).toBeInTheDocument();
        });

        test('should not render Sort when showSort is false', () => {
            renderComponent(defaultProps);
            expect(screen.queryByRole('button', { name: 'Sort' })).not.toBeInTheDocument();
        });

        test('should render Add when showAdd is true', () => {
            renderComponent({
                ...defaultProps,
                canCreateNewFolder: true,
                currentCollection: { items: [{ id: '1' }] },
            });
            expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
        });

        test('should not render Add when showAdd is false', () => {
            renderComponent(defaultProps);
            expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();
        });
    });
});
