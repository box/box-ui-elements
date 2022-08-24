// @flow
import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivitySidebarFilter from '../ActivitySidebarFilter';
import type { FeedItemStatus } from '../../../common/types/feed';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

jest.mock('../messages', () => ({
    activitySidebarFilterOptionAll: {
        defaultMessage: 'All Comments',
    },
    activitySidebarFilterOptionOpen: {
        defaultMessage: 'Unresolved Comments',
    },
    activitySidebarFilterOptionResolved: {
        defaultMessage: 'Resolved Comments',
    },
}));

const onFeedItemStatusClick = jest.fn();

const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    return <IntlProvider locale="en">{children}</IntlProvider>;
};

const renderWithWrapper = (feedItemStatus?: FeedItemStatus) =>
    render(<ActivitySidebarFilter feedItemStatus={feedItemStatus} onFeedItemStatusClick={onFeedItemStatusClick} />, {
        wrapper: Wrapper,
    });

describe('elements/content-sidebar/ActivitySidebarFilter', () => {
    describe('should render selected status name based on feedItemStatus prop', () => {
        test('undefined', () => {
            renderWithWrapper();

            expect(screen.getByText('All Comments')).toBeVisible();
        });

        test('open', () => {
            renderWithWrapper('open');

            expect(screen.getByText('Unresolved Comments')).toBeVisible();
        });

        test('resolved', () => {
            renderWithWrapper('resolved');

            expect(screen.getByText('Resolved Comments')).toBeVisible();
        });
    });

    describe('onFeedItemStatusClick function should be called when clicked on specific option', () => {
        test('Unresolved Comments', async () => {
            renderWithWrapper();

            const dropdownBtn = screen.getByText('All Comments');

            fireEvent.click(dropdownBtn);
            fireEvent.click(await screen.findByText('Unresolved Comments'));

            expect(onFeedItemStatusClick).toBeCalledWith('open');
        });

        test('Resolved Comments', async () => {
            renderWithWrapper();

            const dropdownBtn = screen.getByText('All Comments');

            fireEvent.click(dropdownBtn);
            fireEvent.click(await screen.findByText('Resolved Comments'));

            expect(onFeedItemStatusClick).toBeCalledWith('resolved');
        });

        test('Resolved Comments', async () => {
            renderWithWrapper('open');

            const dropdownBtn = screen.getByText('Unresolved Comments');

            fireEvent.click(dropdownBtn);
            fireEvent.click(await screen.findByText('All Comments'));

            expect(onFeedItemStatusClick).toBeCalledWith(undefined);
        });
    });
});
