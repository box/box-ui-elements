import * as React from 'react';
import { render, screen, userEvent } from '../../../../test-utils/testing-library';
import SubHeaderRight, { SubHeaderRightProps } from '../SubHeaderRight';
import { VIEW_FOLDER, VIEW_METADATA, VIEW_MODE_GRID } from '../../../../constants';
import { FeatureProvider } from '../../feature-checking';

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

    const renderComponent = (props: Partial<SubHeaderRightProps> = {}, features = {}) =>
        render(
            <FeatureProvider features={features}>
                <SubHeaderRight {...defaultProps} {...props} />
            </FeatureProvider>,
        );

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

    describe('metadataViewV2', () => {
        const metadataViewV2Props = {
            ...defaultProps,
            selectedItemIds: 'all' as const,
            bulkItemActions: [
                {
                    label: 'Download',
                    onClick: jest.fn(),
                },
            ],
            view: VIEW_METADATA,
            onMetadataSidePanelToggle: jest.fn(),
        };

        test.each([
            {
                selectedItemIds: 'all' as const,
            },
            {
                selectedItemIds: new Set(['1', '2']),
            },
        ])('should render bulkItemActionMenu when selectedItemIds is $selectedItemIds', async ({ selectedItemIds }) => {
            const features = {
                contentExplorer: {
                    metadataViewV2: true, // enable the feature flag
                },
            };

            renderComponent(
                {
                    ...metadataViewV2Props,
                    selectedItemIds,
                },
                features,
            );

            expect(screen.getByRole('button', { name: 'Bulk actions' })).toBeInTheDocument();
        });

        test('should call onClick when a bulk item action is clicked', async () => {
            const mockOnClick = jest.fn();
            const user = userEvent();
            const features = {
                contentExplorer: {
                    metadataViewV2: true, // enable the feature flag
                },
            };

            renderComponent(
                {
                    ...metadataViewV2Props,
                    bulkItemActions: [
                        {
                            label: 'Download',
                            onClick: mockOnClick,
                        },
                    ],
                },
                features,
            );

            const ellipsisButton = screen.getByRole('button', { name: 'Bulk actions' });

            await user.click(ellipsisButton);

            const downloadAction = screen.getByRole('menuitem', { name: 'Download' });
            await user.click(downloadAction);

            const expectedOnClickArgument = 'all';
            expect(mockOnClick).toHaveBeenCalledWith(expectedOnClickArgument);
        });

        test('should not render metadata button when metadataViewV2 feature is disabled', async () => {
            const features = {
                contentExplorer: {
                    metadataViewV2: false, // Disable the feature flag
                },
            };

            renderComponent(
                {
                    ...metadataViewV2Props,
                },
                features,
            );

            expect(screen.queryByRole('button', { name: 'Bulk actions' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Metadata' })).not.toBeInTheDocument();
        });
    });
});
