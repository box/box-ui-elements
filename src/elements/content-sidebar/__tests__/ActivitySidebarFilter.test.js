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

const onFeedItemStatusClick = jest.fn();

const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    return <IntlProvider locale="en">{children}</IntlProvider>;
};

const renderWithWrapper = (feedItemStatus?: FeedItemStatus) =>
    render(<ActivitySidebarFilter feedItemStatus={feedItemStatus} onFeedItemStatusClick={onFeedItemStatusClick} />, {
        wrapper: Wrapper,
    });

describe('elements/content-sidebar/ActivitySidebarFilter', () => {
    test.each`
        feedItemStatus | option
        ${undefined}   | ${'All Comments'}
        ${'open'}      | ${'Unresolved Comments'}
    `(
        'should render "$option" as the selected status when feedItemStatus prop is equal to $feedItemStatus',
        ({ feedItemStatus, option }) => {
            renderWithWrapper(feedItemStatus);
            expect(screen.getByText(option)).toBeVisible();
        },
    );

    test.each`
        expected     | option                   | initialOption            | initialStatus
        ${undefined} | ${'All Comments'}        | ${'Unresolved Comments'} | ${'open'}
        ${'open'}    | ${'Unresolved Comments'} | ${'All Comments'}        | ${undefined}
    `(
        'onFeedItemStatusClick should be called with $expected when clicked on $option',
        async ({ initialOption, option, initialStatus, expected }) => {
            renderWithWrapper(initialStatus);

            const dropdownBtn = screen.getByText(initialOption);

            fireEvent.click(dropdownBtn);
            fireEvent.click(await screen.findByText(option));

            expect(onFeedItemStatusClick).toBeCalledWith(expected);
        },
    );
});
