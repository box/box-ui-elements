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
import { collapseFeedState, shouldShowEmptyState } from './activityFeedUtils';
import './ActivityFeed.scss';

type Props = {
    file: BoxItem,
    activityFeedError: ?Errors,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    currentUser?: User,
    isDisabled?: boolean,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function,
    onVersionHistoryClick?: Function,
    translations?: Translations,
    getAvatarUrl: string => Promise<?string>,
    getUserProfileUrl?: string => Promise<string>,
    feedItems?: FeedItems,
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
        this.scrollFeedContainerToBottom(false);
    }

    componentDidUpdate(prevProps, prevState) {
        this.scrollFeedContainerToBottom(true, prevProps, prevState);
    }

    scrollFeedContainerToBottom = (
        componentWasUpdated: boolean,
        prevProps?: Props,
        prevState?: State,
    ) => {
        if (
            componentWasUpdated &&
            this.feedContainer &&
            !prevProps.feedItems &&
            this.props.feedItems
        ) {
            this.feedContainer.scrollTop = this.feedContainer.scrollHeight;
        } else if (
            componentWasUpdated &&
            this.feedContainer &&
            prevProps.feedItems &&
            prevProps.feedItems.length < this.props.feedItems.length
        ) {
            this.feedContainer.scrollTop = this.feedContainer.scrollHeight;
        } else if (!componentWasUpdated && this.feedContainer) {
            this.feedContainer.scrollTop = this.feedContainer.scrollHeight;
        } else if (
            this.feedContainer &&
            this.state.isInputOpen !== prevState.isInputOpen
        ) {
            this.feedContainer.scrollTop = this.feedContainer.scrollHeight;
        }
    };

    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = (): void => {
        this.scrollFeedContainerToBottom(false);
        this.setState({ isInputOpen: true });
    };

    approvalCommentFormCancelHandler = (): void =>
        this.setState({ isInputOpen: false });

    approvalCommentFormSubmitHandler = (): void =>
        this.setState({ isInputOpen: false });

    onCommentCreate = ({
        text,
        hasMention,
    }: {
        text: string,
        hasMention: boolean,
    }) => {
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
    onTaskCreate = ({
        text,
        assignees,
        dueAt,
    }: {
        text: string,
        assignees: SelectorItems,
        dueAt: string,
    }): void => {
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
            onCommentCreate,
            getApproverWithQuery,
            getMentionWithQuery,
            activityFeedError,
            onVersionHistoryClick,
            onCommentDelete,
            onTaskDelete,
            onTaskUpdate,
            onTaskAssignmentUpdate,
            feedItems,
        } = this.props;
        const { isInputOpen } = this.state;
        const hasCommentPermission = getProp(
            file,
            'permissions.can_comment',
            false,
        );
        const showApprovalCommentForm = !!(
            currentUser &&
            hasCommentPermission &&
            onCommentCreate &&
            feedItems
        );

        return (
            // eslint-disable-next-line
            <div className="bcs-activity-feed" onKeyDown={this.onKeyDown}>
                <div
                    ref={ref => {
                        this.feedContainer = ref;
                    }}
                    className="bcs-activity-feed-items-container"
                >
                    {shouldShowEmptyState(feedItems) || !currentUser ? (
                        <EmptyState
                            isLoading={!feedItems}
                            showCommentMessage={showApprovalCommentForm}
                        />
                    ) : (
                        <ActiveState
                            {...activityFeedError}
                            items={collapseFeedState(feedItems)}
                            isDisabled={isDisabled}
                            currentUser={currentUser}
                            onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                            onCommentDelete={
                                hasCommentPermission ? onCommentDelete : noop
                            }
                            // We don't know task edit/delete specific permissions,
                            // but you must at least be able to comment to do these operations.
                            onTaskDelete={
                                hasCommentPermission ? onTaskDelete : noop
                            }
                            onTaskEdit={
                                hasCommentPermission ? onTaskUpdate : noop
                            }
                            onVersionInfo={
                                onVersionHistoryClick
                                    ? this.openVersionHistoryPopup
                                    : null
                            }
                            translations={translations}
                            getAvatarUrl={getAvatarUrl}
                            getUserProfileUrl={getUserProfileUrl}
                            mentionSelectorContacts={mentionSelectorContacts}
                            getMentionWithQuery={getMentionWithQuery}
                        />
                    )}
                </div>
                {showApprovalCommentForm ? (
                    <ApprovalCommentForm
                        onSubmit={() => this.scrollFeedContainerToBottom(false)}
                        isDisabled={isDisabled}
                        approverSelectorContacts={approverSelectorContacts}
                        mentionSelectorContacts={mentionSelectorContacts}
                        className={classNames(
                            'bcs-activity-feed-comment-input',
                            {
                                'bcs-is-disabled': isDisabled,
                            },
                        )}
                        createComment={
                            hasCommentPermission ? this.onCommentCreate : noop
                        }
                        createTask={
                            hasCommentPermission ? this.onTaskCreate : noop
                        }
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
