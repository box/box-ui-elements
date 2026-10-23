// @flow

import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, type RenderResult } from '@testing-library/react';

import { BaseCommentMenu } from '../BaseCommentMenu';
import { baseCommmentMenuDefaultProps } from '../stories/common';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const openMenu = (wrapper: RenderResult) => {
    fireEvent.click(wrapper.queryByTestId('comment-actions-menu'));
};

const getWrapper = props =>
    render(
        <IntlProvider locale="en">
            <BaseCommentMenu {...baseCommmentMenuDefaultProps} {...props} />
        </IntlProvider>,
    );

describe('elements/content-sidebar/ActivityFeed/comment/BaseCommentMenu', () => {
    test.each`
        prop            | value    | message
        ${'canResolve'} | ${true}  | ${'Resolve'}
        ${'canResolve'} | ${false} | ${'Resolve'}
        ${'canEdit'}    | ${true}  | ${'Modify'}
        ${'canEdit'}    | ${false} | ${'Modify'}
        ${'canDelete'}  | ${true}  | ${'Delete'}
        ${'canDelete'}  | ${false} | ${'Delete'}
    `(`should render appropriate menu items when $prop is $value`, ({ prop, value, message }) => {
        const wrapper = getWrapper({ [prop]: value });
        openMenu(wrapper);
        if (value) {
            expect(wrapper.getByText(message)).toBeInTheDocument();
        } else {
            expect(wrapper.queryByText(message)).not.toBeInTheDocument();
        }
    });

    test.each`
        canResolve | isResolved | should
        ${true}    | ${true}    | ${'should'}
        ${false}   | ${true}    | ${'should NOT'}
        ${true}    | ${false}   | ${'should NOT'}
        ${false}   | ${false}   | ${'should NOT'}
    `(
        `$should render unresolve menu item when canResolve us $canResolve and isResolved is $isResolved`,
        ({ canResolve, isResolved, should }) => {
            const wrapper = getWrapper({ canResolve, isResolved });
            const message = 'Unresolve';
            openMenu(wrapper);
            if (should === 'should') {
                expect(wrapper.getByText(message)).toBeInTheDocument();
            } else {
                expect(wrapper.queryByText(message)).not.toBeInTheDocument();
            }
        },
    );

    test.each`
        isConfirmingDelete | should
        ${true}            | ${'should'}
        ${false}           | ${'should NOT'}
    `(
        `$should render delete confirmation modal when isConfirmingDelete is $isConfirmingDelete`,
        ({ isConfirmingDelete, should }) => {
            const wrapper = getWrapper({ isConfirmingDelete });
            const message = 'Are you sure you want to permanently delete this comment?';
            openMenu(wrapper);
            if (should === 'should') {
                expect(wrapper.getByText(message)).toBeInTheDocument();
            } else {
                expect(wrapper.queryByText(message)).not.toBeInTheDocument();
            }
        },
    );
});
