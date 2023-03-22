// @flow
import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivitySidebarFilter from '../ActivitySidebarFilter';
import type { ActivityFilterOption, ActivityFilterStatus } from '../../../common/types/feed';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const onFeedItemStatusClick = jest.fn();

const availableActivityFilterOptions: ActivityFilterOption[] = ['all', 'open', 'resolved', 'tasks'];

const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    return <IntlProvider locale="en">{children}</IntlProvider>;
};

const renderWithWrapper = (activityFilterOptions?: ActivityFilterStatus[], feedItemStatus?: ActivityFilterStatus) =>
    render(
        <ActivitySidebarFilter
            activityFilterOptions={activityFilterOptions}
            feedItemStatus={feedItemStatus}
            onFeedItemStatusClick={onFeedItemStatusClick}
        />,
        {
            wrapper: Wrapper,
        },
    );

describe('elements/content-sidebar/ActivitySidebarFilter', () => {
    test.each`
        feedItemStatus | option
        ${undefined}   | ${'All Activity'}
        ${'open'}      | ${'Unresolved Comments'}
        ${'resolved'}  | ${'Resolved Comments'}
        ${'task'}      | ${'Tasks'}
    `(
        'should render "$option" as the selected status when feedItemStatus prop is equal to $feedItemStatus',
        ({ feedItemStatus, option }) => {
            renderWithWrapper(availableActivityFilterOptions, feedItemStatus);
            expect(screen.getByText(option)).toBeVisible();
        },
    );

    test.each`
        expected      | option                   | initialOption            | initialStatus
        ${undefined}  | ${'All Activity'}        | ${'Unresolved Comments'} | ${'open'}
        ${'open'}     | ${'Unresolved Comments'} | ${'All Activity'}        | ${undefined}
        ${'resolved'} | ${'Resolved Comments'}   | ${'All Activity'}        | ${undefined}
        ${'task'}     | ${'Tasks'}               | ${'All Activity'}        | ${undefined}
    `(
        'onFeedItemStatusClick should be called with $expected when clicked on $option',
        async ({ initialOption, option, initialStatus, expected }) => {
            renderWithWrapper(availableActivityFilterOptions, initialStatus);

            const dropdownBtn = screen.getByText(initialOption);

            fireEvent.click(dropdownBtn);
            fireEvent.click(await screen.findByText(option));

            expect(onFeedItemStatusClick).toBeCalledWith(expected);
        },
    );

    test.each`
        filterOptions                           | title
        ${['all']}                              | ${'All Comments'}
        ${['all', 'open']}                      | ${'All Comments'}
        ${['all', 'resolved']}                  | ${'All Comments'}
        ${['all', 'open', 'resolved']}          | ${'All Comments'}
        ${['all', 'open', 'resolved', 'tasks']} | ${'All Activity'}
        ${['all', 'tasks']}                     | ${'All Activity'}
    `(
        'should render $title as the title for the all selection when $filterOptions is passed as the activityFilterOptions prop',
        async ({ filterOptions, title }) => {
            renderWithWrapper(filterOptions, undefined);
            expect(screen.getByText(title)).toBeVisible();
        },
    );
});
