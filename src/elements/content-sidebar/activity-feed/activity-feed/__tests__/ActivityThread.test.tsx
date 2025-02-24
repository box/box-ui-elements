import * as React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ActivityThread from '../ActivityThread';
import localize from '../../../../../../test/support/i18n';
import { replies as repliesMock } from '../fixtures';
import messages from '../messages';
import { Comment } from '../../../../../common/types/feed';

jest.mock('react-intl', () => jest.requireActual('react-intl'));
describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThread', () => {
    const Wrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };

    const getWrapper = (props?: Partial<React.ComponentProps<typeof ActivityThread>>) => {
        const replies = cloneDeep<Array<Comment>>(repliesMock);

        return render(
            <ActivityThread
                replies={replies}
                repliesTotalCount={2}
                hasReplies
                getAvatarUrl={() => Promise.resolve('')}
                {...props}
            >
                Test
            </ActivityThread>,
            { wrapper: Wrapper },
        );
    };

    test('should render children component wrapped in ActivityThread if hasReplies is true', () => {
        getWrapper();

        expect(screen.queryByTestId('activity-thread')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeVisible();
    });

    test('should render children component if hasReplies is false', () => {
        const { getByText } = getWrapper({ hasReplies: false });

        expect(screen.queryByTestId('activity-thread')).not.toBeInTheDocument();
        expect(getByText('Test')).toBeVisible();
    });

    test('should render button and call onShowReplies on click if total replies is greater than the number of replies in Feed', () => {
        const onShowReplies = jest.fn();
        const replies = [cloneDeep(repliesMock[0])];
        const { getByText } = getWrapper({ onShowReplies, replies });

        const button = getByText(localize(messages.showReplies.id, { repliesToLoadCount: 1 }));
        expect(button).toBeVisible();
        fireEvent.click(button);

        expect(onShowReplies).toBeCalled();
    });

    test('should render button and call onHideReplies on click if total replies is equal to the number of replies in Feed', () => {
        const onHideReplies = jest.fn();
        const lastReply = cloneDeep(repliesMock[repliesMock.length - 1]);
        const { getByText } = getWrapper({ onHideReplies });

        const button = getByText(localize(messages.hideReplies.id));
        expect(button).toBeVisible();
        fireEvent.click(button);

        expect(onHideReplies).toBeCalledWith(lastReply);
    });

    test.each`
        repliesTotalCount | replies
        ${0}              | ${[]}
        ${1}              | ${[{ id: 1 }]}
    `(
        'should not render button if repliesTotalCount = $repliesTotalCount and replies = $replies',
        ({ replies, repliesTotalCount }) => {
            const { queryByTestId } = getWrapper({ replies, repliesTotalCount });
            expect(queryByTestId('activity-thread-button')).not.toBeInTheDocument();
        },
    );

    test('should not render replies if there is no replies', () => {
        const { queryByTestId } = getWrapper({ replies: [] });

        expect(queryByTestId('activity-thread-replies')).not.toBeInTheDocument();
    });

    test('should render LoadingIndicator and do not render button if repliesLoading is true', () => {
        const { queryByTestId } = getWrapper({ isRepliesLoading: true });

        expect(queryByTestId('activity-thread-button')).not.toBeInTheDocument();
        expect(queryByTestId('activity-thread-replies-loading')).toBeInTheDocument();
    });

    test('should NOT have reply button when onReplyCreate is not passed', () => {
        getWrapper({ onReplyCreate: undefined });

        expect(screen.queryByRole('button', { name: localize(messages.reply.id) })).not.toBeInTheDocument();
    });

    test('should have reply button when onReplyCreate is passed', () => {
        getWrapper({
            onReplyCreate: () => {
                /* intentionally empty for testing */
            },
        });

        expect(screen.getByRole('button', { name: localize(messages.reply.id) })).toBeInTheDocument();
    });

    test('should disable reply button when ietm is in pending state', () => {
        getWrapper({ isPending: true, onReplyCreate: jest.fn() });
        const replyButton = screen.getByRole('button', { name: localize(messages.reply.id) });
        expect(replyButton).toHaveAttribute('aria-disabled', 'true');
    });
});
