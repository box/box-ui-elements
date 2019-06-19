/**
 * @flow
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import classNames from 'classnames';
import ActiveState from './ActiveState';
import ApprovalCommentForm from '../approval-comment-form';
import EmptyState from './EmptyState';
import { collapseFeedState, ItemTypes } from './activityFeedUtils';
import './ActivityFeed.scss';

type Props = {
    activityFeedError: ?Errors,
    approverSelectorContacts?: SelectorItems,
    currentUser?: User,
    feedItems?: FeedItems,
    file: BoxItem,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    isDisabled?: boolean,
    mentionSelectorContacts?: SelectorItems,
    onAppActivityDelete?: Function,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskModalClose?: Function,
    onTaskUpdate?: Function,
    onVersionHistoryClick?: Function,
    translations?: Translations,
};

type State = {
    isInputOpen: boolean,
};

class ActivityFeed extends React.Component<Props, State> {
    state = {
        isInputOpen: false,
    };

    feedContainer: null | HTMLElement;

    componentDidMount() {
        this.resetFeedScroll();
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { feedItems: prevFeedItems } = prevProps;
        const { feedItems: currFeedItems } = this.props;
        const { isInputOpen: prevIsInputOpen } = prevState;
        const { isInputOpen: currIsInputOpen } = this.state;

        const isEmpty = this.isEmpty(this.props);
        const wasEmpty = this.isEmpty(prevProps);
        const hasLoaded = isEmpty !== wasEmpty && !isEmpty;

        const hasMoreItems = prevFeedItems && currFeedItems && prevFeedItems.length < currFeedItems.length;
        const hasNewItems = !prevFeedItems && currFeedItems;
        const hasInputOpened = currIsInputOpen !== prevIsInputOpen;

        if (hasLoaded || hasMoreItems || hasNewItems || hasInputOpened) {
            this.resetFeedScroll();
        }
    }

    /**
     * Detects whether or not the empty state should be shown.
     * @param {object} currentUser - The user that is logged into the account
     * @param {object} feedItems - Items in the activity feed
     */
    isEmpty = ({ currentUser, feedItems }: Props = this.props): boolean =>
        !currentUser ||
        !feedItems ||
        feedItems.length === 0 ||
        (feedItems.length === 1 && feedItems[0].type === ItemTypes.fileVersion);

    /**
     * Scrolls the container to the bottom
     */
    resetFeedScroll = () => {
        if (this.feedContainer) {
            this.feedContainer.scrollTop = this.feedContainer.scrollHeight;
        }
    };

    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = (): void => {
        this.resetFeedScroll();
        this.setState({ isInputOpen: true });
    };

    approvalCommentFormCancelHandler = (): void => this.setState({ isInputOpen: false });

    approvalCommentFormSubmitHandler = (): void => this.setState({ isInputOpen: false });

    onCommentCreate = ({ text, hasMention }: { hasMention: boolean, text: string }) => {
        const { onCommentCreate = noop } = this.props;
        onCommentCreate(text, hasMention);
        this.approvalCommentFormSubmitHandler();
    };

    /**
     * Creates a task.
     *
     * @param {string} text - Task text
     * @param {Array} assignees - List of assignees
     * @param {number} dueAt - Task's due date
     * @return {void}
     */
    onTaskCreate = ({ text, assignees, dueAt }: { assignees: SelectorItems, dueAt: string, text: string }): void => {
        const { onTaskCreate = noop } = this.props;
        onTaskCreate(text, assignees, dueAt);
        this.approvalCommentFormSubmitHandler();
    };

    /**
     * Invokes version history popup handler.
     *
     * @param {Object} data - Version history data
     * @return {void}
     */
    openVersionHistoryPopup = (data: any): void => {
        const versionInfoHandler = this.props.onVersionHistoryClick || noop;
        versionInfoHandler(data);
    };

    render(): React.Node {
        const {
            translations,
            approverSelectorContacts,
            mentionSelectorContacts,
            currentUser,
            isDisabled,
            getAvatarUrl,
            getUserProfileUrl,
            file,
            onAppActivityDelete,
            onCommentCreate,
            getApproverWithQuery,
            getMentionWithQuery,
            activityFeedError,
            onVersionHistoryClick,
            onCommentDelete,
            onTaskDelete,
            onTaskUpdate,
            onTaskAssignmentUpdate,
            onTaskModalClose,
            feedItems,
        } = this.props;
        const { isInputOpen } = this.state;
        const hasCommentPermission = getProp(file, 'permissions.can_comment', false);
        const showApprovalCommentForm = !!(currentUser && hasCommentPermission && onCommentCreate && feedItems);

        const isEmpty = this.isEmpty(this.props);
        const isLoading = !feedItems || !currentUser;

        return (
            // eslint-disable-next-line
            <div className="bcs-activity-feed" data-testid="activityfeed" onKeyDown={this.onKeyDown}>
                <div
                    ref={ref => {
                        this.feedContainer = ref;
                    }}
                    className="bcs-activity-feed-items-container"
                >
                    {isEmpty ? (
                        <EmptyState isLoading={isLoading} showCommentMessage={showApprovalCommentForm} />
                    ) : (
                        <ActiveState
                            {...activityFeedError}
                            items={collapseFeedState(feedItems)}
                            isDisabled={isDisabled}
                            currentUser={currentUser}
                            onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                            onAppActivityDelete={onAppActivityDelete}
                            onCommentDelete={hasCommentPermission ? onCommentDelete : noop}
                            // We don't know task edit/delete specific permissions,
                            // but you must at least be able to comment to do these operations.
                            onTaskDelete={hasCommentPermission ? onTaskDelete : noop}
                            onTaskEdit={hasCommentPermission ? onTaskUpdate : noop}
                            onTaskModalClose={onTaskModalClose}
                            onVersionInfo={onVersionHistoryClick ? this.openVersionHistoryPopup : null}
                            translations={translations}
                            getAvatarUrl={getAvatarUrl}
                            getUserProfileUrl={getUserProfileUrl}
                            mentionSelectorContacts={mentionSelectorContacts}
                            getMentionWithQuery={getMentionWithQuery}
                            approverSelectorContacts={approverSelectorContacts}
                            getApproverWithQuery={getApproverWithQuery}
                        />
                    )}
                </div>
                {showApprovalCommentForm ? (
                    <ApprovalCommentForm
                        onSubmit={this.resetFeedScroll}
                        isDisabled={isDisabled}
                        approverSelectorContacts={approverSelectorContacts}
                        mentionSelectorContacts={mentionSelectorContacts}
                        className={classNames('bcs-activity-feed-comment-input', {
                            'bcs-is-disabled': isDisabled,
                        })}
                        createComment={hasCommentPermission ? this.onCommentCreate : noop}
                        createTask={hasCommentPermission ? this.onTaskCreate : noop}
                        updateTask={hasCommentPermission ? onTaskUpdate : noop}
                        getApproverWithQuery={getApproverWithQuery}
                        getMentionWithQuery={getMentionWithQuery}
                        isOpen={isInputOpen}
                        user={currentUser}
                        onCancel={this.approvalCommentFormCancelHandler}
                        onFocus={this.approvalCommentFormFocusHandler}
                        getAvatarUrl={getAvatarUrl}
                    />
                ) : null}
            </div>
        );
    }
}

export default ActivityFeed;
