// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';
import ActivitySidebarFilter from '../ActivitySidebarFilter';
// $FlowFixMe
import { ActivityFilterItemType, ActivityFilterOption } from '../../../common/types/feed';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const onFeedItemTypeClick = jest.fn();

const availableActivityFilterOptions: ActivityFilterOption[] = ['all', 'open', 'resolved', 'tasks'];

const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    return <IntlProvider locale="en">{children}</IntlProvider>;
};

const renderWithWrapper = (activityFilterOptions?: ActivityFilterOption[], feedItemType?: ActivityFilterItemType) =>
    render(
        <ActivitySidebarFilter
            activityFilterOptions={activityFilterOptions}
            feedItemType={feedItemType}
            onFeedItemTypeClick={onFeedItemTypeClick}
        />,
        {
            wrapper: Wrapper,
        },
    );

describe('elements/content-sidebar/ActivitySidebarFilter', () => {
    test.each`
        feedItemType  | option
        ${'all'}      | ${'All Activity'}
        ${'open'}     | ${'Unresolved Comments'}
        ${'resolved'} | ${'Resolved Comments'}
        ${'task'}     | ${'Tasks'}
    `(
        'should render "$option" as the selected status when feedItemType prop is equal to $feedItemType',
        ({ feedItemType, option }) => {
            renderWithWrapper(availableActivityFilterOptions, feedItemType);
            expect(screen.getByText(option)).toBeVisible();
        },
    );

    test.each`
        expected      | option                   | initialOption            | initialType
        ${'all'}      | ${'All Activity'}        | ${'Unresolved Comments'} | ${'open'}
        ${'open'}     | ${'Unresolved Comments'} | ${'All Activity'}        | ${undefined}
        ${'resolved'} | ${'Resolved Comments'}   | ${'All Activity'}        | ${undefined}
        ${'task'}     | ${'Tasks'}               | ${'All Activity'}        | ${undefined}
    `(
        'onFeedItemStatusClick should be called with $expected when clicked on $option',
        async ({ initialOption, option, initialType, expected }) => {
            renderWithWrapper(availableActivityFilterOptions, initialType);

            const dropdownBtn = screen.getByText(initialOption);

            fireEvent.click(dropdownBtn);
            fireEvent.click(await screen.findByText(option));

            expect(onFeedItemTypeClick).toBeCalledWith(expected);
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
