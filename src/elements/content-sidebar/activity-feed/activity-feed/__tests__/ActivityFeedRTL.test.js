// @flow
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import noop from 'lodash/noop';
import { IntlProvider } from 'react-intl';

import ActivityFeed from '../ActivityFeed';
import { FEED_ITEM_TYPE_COMMENT } from '../../../../../constants';
import localize from '../../../../../../test/support/i18n';
import messages from '../messages';
import { file, currentUser } from './ActivityFeed.test';

jest.mock('../../comment-form/CommentForm', () => {
    const CommentForm = ({ onFocus }: any) => {
        return <input data-testid="comment-form" onFocus={onFocus} />;
    };
    return CommentForm;
});
jest.mock('react-intl', () => jest.requireActual('react-intl'));

const createComment = (id = 1) => {
    return {
        type: FEED_ITEM_TYPE_COMMENT,
        id,
        created_at: 'Thu Sep 26 33658 19:46:39 GMT-0600 (CST)',
        tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
        created_by: { name: 'Akon', id: 11 },
        permissions: {
            can_edit: true,
        },
    };
};

describe('elements/content-sidebar/ActivityFeed/activity-feed/ActivityFeed', () => {
    const Wrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };

    const renderComponent = props =>
        render(<ActivityFeed currentUser={currentUser} file={file} {...props} />, {
            wrapper: Wrapper,
        });

    test('should disable Reply button if isDisabled property is true1212', async () => {
        const feedItems = [createComment(1), createComment(2)];
        const { rerender } = renderComponent({
            feedItems,
            hasNewThreadedReplies: true,
            onCommentUpdate: noop,
            onReplyCreate: noop,
            hasReplies: true,
        });

        const comments = screen.getAllByTestId('comment');
        const menuButtons = screen.getAllByTestId('comment-actions-menu');
        const replyButtons = screen.queryAllByText(localize(messages.reply.id));
        const comment2ReplyButton = replyButtons[1];
        const comment1MenuButton = menuButtons[0];

        fireEvent.click(comment2ReplyButton);
        const comment2Input = screen.getByTestId('comment-form');
        fireEvent.click(comment1MenuButton);
        fireEvent.click(comment2Input);
        fireEvent.focus(comment2Input);

        rerender(
            <ActivityFeed
                currentUser={currentUser}
                file={file}
                feedItems={feedItems}
                hasNewThreadedReplies
                onCommentUpdate={noop}
                onReplyCreate={noop}
                hasReplies
                isDisabled
            />,
        );

        expect(comments[1]).toHaveClass('bcs-is-focused');
    });
});
