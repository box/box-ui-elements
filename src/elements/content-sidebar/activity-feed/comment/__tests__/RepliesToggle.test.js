// @flow

import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import RepliesToggle from '../RepliesToggle';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
}));

const showReplies = jest.fn();
const hideReplies = jest.fn();
const shownCount = 1;
const totalCount = 9;

const getWrapper = props =>
    render(
        <IntlProvider locale="en">
            <RepliesToggle
                id="123"
                isRepliesLoading={false}
                onShowReplies={showReplies}
                onHideReplies={hideReplies}
                repliesShownCount={shownCount}
                repliesTotalCount={totalCount}
                {...props}
            />
        </IntlProvider>,
    );

describe('elements/content-sidebar/ActivityFeed/comment/RepliesToggle', () => {
    test('should correctly render show toggle', () => {
        const countDifference = totalCount - 1;

        getWrapper();

        expect(screen.getByText(`See ${countDifference} replies`)).toBeVisible();
        expect(screen.queryByText('Hide replies')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText(`See ${countDifference} replies`));

        expect(showReplies).toBeCalledTimes(1);
        expect(hideReplies).not.toBeCalled();
    });

    test.each`
        repliesShownCount | repliesTotalCount
        ${3}              | ${3}
        ${3}              | ${2}
    `(
        `Should correctly render hide toggle when shown count is $repliesShownCount and total count is $repliesTotalCount`,
        ({ repliesShownCount, repliesTotalCount }) => {
            getWrapper({ repliesShownCount, repliesTotalCount });

            expect(screen.getByText('Hide replies')).toBeVisible();
            expect(screen.queryByText(`See ${repliesTotalCount - 1} replies`)).not.toBeInTheDocument();

            fireEvent.click(screen.getByText(`Hide replies`));

            expect(hideReplies).toBeCalledTimes(1);
            expect(hideReplies).toBeCalledWith(repliesShownCount - 1);
            expect(showReplies).not.toBeCalled();
        },
    );

    test.each`
        repliesShownCount | repliesTotalCount
        ${3}              | ${1}
        ${3}              | ${0}
        ${1}              | ${0}
        ${1}              | ${1}
    `(
        `Should not render toggle when shown count is $repliesShownCount and total count is $repliesTotalCount`,
        ({ repliesShownCount, repliesTotalCount }) => {
            getWrapper({ repliesShownCount, repliesTotalCount });

            expect(screen.queryByText(`Hide replies`)).not.toBeInTheDocument();
            expect(screen.queryByText(`See ${repliesTotalCount} replies`)).not.toBeInTheDocument();
        },
    );
});
