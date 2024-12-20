import React from 'react';
import { render, screen, waitFor, fireEvent } from '../../../test-utils/testing-library';

import { DocGenSidebarComponent as DocGenSidebar } from '../DocGenSidebar/DocGenSidebar';
import mockData from '../__mocks__/DocGenSidebar.mock';

const docGenSidebarProps = {
    getDocGenTags: jest.fn().mockReturnValue(
        Promise.resolve({
            pagination: {},
            data: mockData,
        }),
    ),
};

const noTagsMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
const errorTagsMock = jest.fn().mockRejectedValue([]);
const noDataMock = jest.fn().mockReturnValue(Promise.resolve({}));

describe('elements/content-sidebar/DocGenSidebar', () => {
    const renderComponent = (props = {}) =>
        render(<DocGenSidebar logger={{ onReadyMetric: jest.fn() }} {...docGenSidebarProps} {...props} />);

    test('componentDidMount() should call fetch tags', async () => {
        renderComponent();
        await waitFor(() => expect(docGenSidebarProps.getDocGenTags).toHaveBeenCalled());
    });

    test('should render DocGen sidebar component correctly with tags list', async () => {
        renderComponent();
        const tagList = await screen.findAllByTestId('bcs-TagsSection');
        expect(tagList).toHaveLength(2);
    });

    test('should render DocGen sidebar component correctly with tags list', async () => {
        renderComponent();
        const parentTag = await screen.findByText('about');
        let nestedTag = await screen.queryByText('name');

        expect(parentTag).toBeInTheDocument();
        expect(nestedTag).not.toBeInTheDocument();

        fireEvent.click(parentTag);

        nestedTag = await screen.findByText('name');
        expect(nestedTag).toBeInTheDocument();
    });

    test('should render empty state when there are no tags', async () => {
        renderComponent({
            getDocGenTags: noTagsMock,
        });

        const emptyState = await screen.findByText('This document has no tags');
        expect(emptyState).toBeInTheDocument();
    });

    test('should render loading state', async () => {
        const mockGetDocGenTags = jest.fn().mockReturnValue(
            new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        data: mockData,
                    });
                }, 1000);
            }),
        );

        renderComponent({
            getDocGenTags: mockGetDocGenTags,
        });

        expect(await screen.findByRole('status', { name: 'Loading' })).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument();
        });
    });

    test('should re-trigger getDocGenTags on click on refresh button', async () => {
        renderComponent({
            getDocGenTags: errorTagsMock,
        });

        const errorState = await screen.findByTestId('docgen-sidebar-error');
        expect(errorState).toBeInTheDocument();

        const refreshButton = screen.getByRole('button', { name: 'Process document' });
        fireEvent.click(refreshButton);

        await waitFor(() => expect(errorTagsMock).toBeCalledTimes(2));
    });

    test('should handle undefined data', async () => {
        renderComponent({
            getDocGenTags: noDataMock,
        });

        const emptyState = await screen.findByText(
            'Looks like your recent changes to the Doc Gen template are yet to be processed.',
        );
        expect(emptyState).toBeInTheDocument();
    });
});
