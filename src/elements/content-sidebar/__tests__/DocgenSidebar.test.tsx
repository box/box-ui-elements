import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MessageDescriptor, IntlProvider } from 'react-intl';

import { DocGenSidebarComponent as DocGenSidebar } from '../DocGenSidebar/DocGenSidebar';
import mockData from '../__mocks__/DocGenSidebar';

const intl = {
    formatMessage: (message: MessageDescriptor) => message.defaultMessage,
};

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const docGenSidebarProps = {
    getDocGenTags: jest.fn().mockReturnValue(
        Promise.resolve({
            pagination: {},
            data: mockData,
        }),
    ),
    intl,
};

const noTagsMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
const errorTagsMock = jest.fn().mockRejectedValue([]);
const noDataMock = jest.fn().mockReturnValue(Promise.resolve({}));

const defaultProps = {
    ...docGenSidebarProps,
};

describe('elements/content-sidebar/DocGenSidebar', () => {
    const Wrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };

    const renderComponent = (props = defaultProps) =>
        render(<DocGenSidebar logger={{ onReadyMetric: jest.fn() }} {...props} />, { wrapper: Wrapper });

    test('componentDidMount() should call fetch tags', async () => {
        renderComponent();
        await waitFor(() => expect(docGenSidebarProps.getDocGenTags).toHaveBeenCalled());
    });

    test('should render DocGen sidebar component correctly with tags list', async () => {
        renderComponent();
        const tagList = await screen.findAllByTestId(/bcs-TagsSection/);
        expect(tagList).toHaveLength(2);
        expect(document.body).toMatchSnapshot();
    });

    test('should render empty state when there are no tags', async () => {
        renderComponent({
            ...defaultProps,
            getDocGenTags: noTagsMock,
        });

        const emptyState = await screen.findByText('This document has no tags');
        expect(emptyState).toBeInTheDocument();
        expect(document.body).toMatchSnapshot();
    });

    test('should render loading state', async () => {
        renderComponent({
            ...defaultProps,
            getDocGenTags: noTagsMock,
        });

        const loadingState = await screen.getByTestId('loading-indicator'); // Assuming LoadingIndicator has a test id
        expect(loadingState).toBeInTheDocument();
        expect(document.body).toMatchSnapshot();
    });

    test('should re-trigger getDocGenTags on click on refresh button', async () => {
        renderComponent({
            ...defaultProps,
            getDocGenTags: errorTagsMock,
        });

        const errorState = await screen.findByTestId('docgen-sidebar-error');
        expect(errorState).toBeInTheDocument();
        expect(document.body).toMatchSnapshot();

        const refreshButton = screen.getByRole('button');
        fireEvent.click(refreshButton);

        await waitFor(() => expect(errorTagsMock).toBeCalledTimes(2));
    });

    test('should handle undefined data', async () => {
        renderComponent({
            ...defaultProps,
            getDocGenTags: noDataMock,
        });

        const emptyState = await screen.findByText("We couldn't load the tags");
        expect(emptyState).toBeInTheDocument();
        expect(document.body).toMatchSnapshot();
    });
});
