// @flow
import * as React from 'react';
import { mount } from 'enzyme';
import noop from 'lodash/noop';
import { IntlProvider } from 'react-intl';

import ActivityFeed from '../ActivityFeed';
import { FEED_ITEM_TYPE_COMMENT } from '../../../../../constants';
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

    const mountComponent = props =>
        mount(<ActivityFeed currentUser={currentUser} file={file} {...props} />, {
            wrappingComponent: Wrapper,
        });

    it('should highlight the initial comment when opening the menu of another comment and then focusing on the initial comment again', () => {
        const feedItems = [createComment(1), createComment(2)];
        const wrapper = mountComponent({
            feedItems,
            hasNewThreadedReplies: true,
            onCommentUpdate: noop,
            onReplyCreate: noop,
            hasReplies: true,
        });

        // filter out DOM nodes. We only want to test React components
        const menuButtons = wrapper.find('.bdl-Media-menu').filterWhere(n => {
            return typeof n.type() === 'function';
        });
        const replyButtons = wrapper.find('.bcs-CreateReply-toggle').filterWhere(n => {
            return typeof n.type() === 'function';
        });
        const comment2ReplyButton = replyButtons.at(1);
        const comment1MenuButton = menuButtons.at(0);

        comment2ReplyButton.simulate('click');
        const comment2Input = wrapper.find('.bcs-CreateReply-form');
        comment1MenuButton.simulate('click');
        // click by it self does not trigger onFocus event so we need to call onFocus manually
        // and then click ¯\_(ツ)_/¯
        comment2Input.prop('onFocus')();
        comment2Input.simulate('click');

        const comments = wrapper.find('[data-testid="comment"]').filterWhere(n => {
            return typeof n.type() === 'string';
        });

        expect(comments.at(1).hasClass('bcs-is-focused')).toBe(true);
    });
});
