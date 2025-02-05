import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, RenderResult } from '@testing-library/react';

import { BaseCommentMenu } from '../BaseCommentMenu';
import { baseCommmentMenuDefaultProps } from '../stories/common';
import localize from '../../../../../../../test/support/i18n';

import messages from '../../messages';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const openMenu = (wrapper: RenderResult) => {
    fireEvent.click(wrapper.queryByTestId('comment-actions-menu')!);
};

const getWrapper = (props: Partial<React.ComponentProps<typeof BaseCommentMenu>>) =>
    render(
        <IntlProvider locale="en">
            <BaseCommentMenu {...baseCommmentMenuDefaultProps} {...props} />
        </IntlProvider>,
    );

describe('elements/content-sidebar/ActivityFeed/comment/BaseCommentMenu', () => {
    test.each`
        prop            | value    | message
        ${'canResolve'} | ${true}  | ${localize(messages.commentResolveMenuItem.id)}
        ${'canResolve'} | ${false} | ${localize(messages.commentResolveMenuItem.id)}
        ${'canEdit'}    | ${true}  | ${localize(messages.commentEditMenuItem.id)}
        ${'canEdit'}    | ${false} | ${localize(messages.commentEditMenuItem.id)}
        ${'canDelete'}  | ${true}  | ${localize(messages.commentDeleteMenuItem.id)}
        ${'canDelete'}  | ${false} | ${localize(messages.commentDeleteMenuItem.id)}
    `('should render appropriate menu items when $prop is $value', ({ prop, value, message }) => {
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
        '$should render unresolve menu item when canResolve us $canResolve and isResolved is $isResolved',
        ({ canResolve, isResolved, should }) => {
            const wrapper = getWrapper({ canResolve, isResolved });
            const message = localize(messages.commentUnresolveMenuItem.id);
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
        '$should render delete confirmation modal when isConfirmingDelete is $isConfirmingDelete',
        ({ isConfirmingDelete, should }) => {
            const wrapper = getWrapper({ isConfirmingDelete });
            const message = localize(messages.commentDeletePrompt.id);
            openMenu(wrapper);
            if (should === 'should') {
                expect(wrapper.getByText(message)).toBeInTheDocument();
            } else {
                expect(wrapper.queryByText(message)).not.toBeInTheDocument();
            }
        },
    );
});
