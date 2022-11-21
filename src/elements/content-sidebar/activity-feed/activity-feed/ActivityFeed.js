/**
 * @flow
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import ActiveState from './ActiveState';
import CommentForm from '../comment-form';
import EmptyState from './EmptyState';
import InlineError from '../../../../components/inline-error/InlineError';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';
import messages from './messages';
import { collapseFeedState, ItemTypes } from './activityFeedUtils';
import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    PERMISSION_CAN_CREATE_ANNOTATIONS,
} from '../../../../constants';
import { scrollIntoView } from '../../../../utils/dom';
import type {
    Annotation,
    AnnotationPermission,
    BoxCommentPermission,
    Comment,
    CommentFeedItemType,
    FeedItemStatus,
    FeedItems,
    FocusableFeedItemType,
    Task,
} from '../../../../common/types/feed';
import type { SelectorItems, User, GroupMini, BoxItem } from '../../../../common/types/core';
import type { Errors, GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import './ActivityFeed.scss';

type Props = {
    activeFeedEntryId?: string,
    activeFeedEntryType?: FocusableFeedItemType,
    activityFeedError: ?Errors,
    approverSelectorContacts?: SelectorItems<User | GroupMini>,
    contactsLoaded?: boolean,
    currentUser?: User,
    feedItems?: FeedItems,
    file: BoxItem,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies?: boolean,
    hasVersions?: boolean,
    isDisabled?: boolean,
    mentionSelectorContacts?: SelectorItems<User>,
    onAnnotationDelete?: ({ id: string, permissions: AnnotationPermission }) => void,
    onAnnotationEdit?: (id: string, text: string, permissions: AnnotationPermission) => void,
    onAnnotationSelect?: (annotation: Annotation) => void,
    onAnnotationStatusChange?: (id: string, status: FeedItemStatus, permissions: AnnotationPermission) => void,
    onAppActivityDelete?: Function,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onCommentUpdate?: (
        id: string,
        text?: string,
        status?: FeedItemStatus,
        hasMention: boolean,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ) => void,
    onHideReplies?: (id: string, replies: Array<Comment>) => void,
    onReplyCreate?: (parentId: string, parentType: CommentFeedItemType, text: string) => void,
    onReplyDelete?: ({ id: string, parentId: string, permissions: BoxCommentPermission }) => void,
    onReplyUpdate?: (
        id: string,
        parentId: string,
        text: string,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ) => void,
    onShowReplies?: (id: string, type: CommentFeedItemType) => void,
    onTaskAssignmentUpdate?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskModalClose?: Function,
    onTaskUpdate?: Function,
    onTaskView?: Function,
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

    activeFeedItemRef = React.createRef<null | HTMLElement>();

    feedContainer: null | HTMLElement;

    componentDidMount() {
        this.resetFeedScroll();
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const {
            activeFeedEntryId: prevActiveFeedEntryId,
            currentUser: prevCurrentUser,
            feedItems: prevFeedItems,
        } = prevProps;
        const { feedItems: currFeedItems, activeFeedEntryId } = this.props;
        const { isInputOpen: prevIsInputOpen } = prevState;
        const { isInputOpen: currIsInputOpen } = this.state;

        const hasLoaded = this.hasLoaded(prevCurrentUser, prevFeedItems);
        const hasMoreItems = prevFeedItems && currFeedItems && prevFeedItems.length < currFeedItems.length;
        const didLoadFeedItems = prevFeedItems === undefined && currFeedItems !== undefined;
        const hasInputOpened = currIsInputOpen !== prevIsInputOpen;
        const hasActiveFeedEntryIdChanged = activeFeedEntryId !== prevActiveFeedEntryId;

        if ((hasLoaded || hasMoreItems || didLoadFeedItems || hasInputOpened) && activeFeedEntryId === undefined) {
            this.resetFeedScroll();
        }

        if (didLoadFeedItems || hasActiveFeedEntryIdChanged) {
            this.scrollToActiveFeedItemOrErrorMessage();
        }
    }

    scrollToActiveFeedItemOrErrorMessage() {
        const { current: activeFeedItemRef } = this.activeFeedItemRef;
        const { activeFeedEntryId } = this.props;

        // if there is no active item, do not scroll
        if (!activeFeedEntryId) {
            return;
        }

        // if there was supposed to be an active feed item but the feed item does not exist
        // scroll to the bottom to show the inline error message
        if (activeFeedItemRef === null) {
            this.resetFeedScroll();
            return;
        }

        scrollIntoView(activeFeedItemRef);
    }

    /**
     * Detects whether or not the empty state should be shown.
     * @param {object} currentUser - The user that is logged into the account
     * @param {object} feedItems - Items in the activity feed
     */
    isEmpty = ({ feedItems }: Props = this.props): boolean => {
        if (feedItems === undefined) {
            return false;
        }
        return feedItems.length === 0 || (feedItems.length === 1 && feedItems[0].type === ItemTypes.fileVersion);
    };

    /**
     * Determines whether currentUser and feedItems have loaded.
     * @param prevCurrentUser - The previous value of the currentUser prop
     * @param prevFeedItems - The previous value of the feedItems prop
     * @returns {boolean}
     */
    hasLoaded = (prevCurrentUser?: User, prevFeedItems?: FeedItems): boolean => {
        const { currentUser, feedItems } = this.props;
        return currentUser !== undefined && feedItems !== undefined && (!prevCurrentUser || !prevFeedItems);
    };

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

    commentFormFocusHandler = (): void => {
        this.resetFeedScroll();
        this.setState({ isInputOpen: true });
    };

    commentFormCancelHandler = (): void => this.setState({ isInputOpen: false });

    commentFormSubmitHandler = (): void => this.setState({ isInputOpen: false });

    onCommentCreate = ({ text, hasMention }: { hasMention: boolean, text: string }) => {
        const { onCommentCreate = noop } = this.props;
        onCommentCreate(text, hasMention);
        this.commentFormSubmitHandler();
    };

    /**
     * Creates a task.
     *
     * @param {string} text - Task text
     * @param {Array} assignees - List of assignees
     * @param {number} dueAt - Task's due date
     * @return {void}
     */
    onTaskCreate = ({ text, assignees, dueAt }: { assignees: SelectorItems<>, dueAt: string, text: string }): void => {
        const { onTaskCreate = noop } = this.props;
        onTaskCreate(text, assignees, dueAt);
        this.commentFormSubmitHandler();
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

    isFeedItemActive = <T, U: { id: string, type: T }>({ id, type }: U): boolean => {
        const { activeFeedEntryId, activeFeedEntryType } = this.props;

        return id === activeFeedEntryId && type === activeFeedEntryType;
    };

    isCommentFeedItemActive = <T, U: { id: string, replies?: Array<Comment>, type: T }>(item: U): boolean => {
        const { activeFeedEntryId } = this.props;
        const { replies } = item;

        const isActive = this.isFeedItemActive<T, U>(item);
        return isActive || (!!replies && replies.some(reply => reply.id === activeFeedEntryId));
    };

    render(): React.Node {
        const {
            activeFeedEntryType,
            activityFeedError,
            approverSelectorContacts,
            currentUser,
            feedItems,
            file,
            getApproverWithQuery,
            getAvatarUrl,
            getMentionWithQuery,
            getUserProfileUrl,
            hasReplies,
            hasVersions,
            isDisabled,
            mentionSelectorContacts,
            contactsLoaded,
            onAnnotationDelete,
            onAnnotationEdit,
            onAnnotationSelect,
            onAnnotationStatusChange,
            onAppActivityDelete,
            onCommentCreate,
            onCommentDelete,
            onCommentUpdate,
            onHideReplies,
            onReplyCreate,
            onReplyDelete,
            onReplyUpdate,
            onShowReplies,
            onTaskAssignmentUpdate,
            onTaskDelete,
            onTaskModalClose,
            onTaskUpdate,
            onTaskView,
            onVersionHistoryClick,
            translations,
        } = this.props;
        const { isInputOpen } = this.state;
        const currentFileVersionId = getProp(file, 'file_version.id');
        const hasAnnotationCreatePermission = getProp(file, ['permissions', PERMISSION_CAN_CREATE_ANNOTATIONS], false);
        const hasCommentPermission = getProp(file, 'permissions.can_comment', false);
        const showCommentForm = !!(currentUser && hasCommentPermission && onCommentCreate && feedItems);

        const isEmpty = this.isEmpty(this.props);
        const isLoading = !this.hasLoaded();

        const activeFeedItem =
            Array.isArray(feedItems) &&
            feedItems.find(item => {
                switch (item.type) {
                    case FEED_ITEM_TYPE_ANNOTATION:
                        return this.isCommentFeedItemActive<typeof FEED_ITEM_TYPE_ANNOTATION, Annotation>(item);
                    case FEED_ITEM_TYPE_COMMENT:
                        return this.isCommentFeedItemActive<typeof FEED_ITEM_TYPE_COMMENT, Comment>(item);
                    case FEED_ITEM_TYPE_TASK:
                        return this.isFeedItemActive<typeof FEED_ITEM_TYPE_TASK, Task>(item);
                    default:
                        return false;
                }
            });

        const errorMessageByEntryType = {
            annotation: messages.annotationMissingError,
            comment: messages.commentMissingError,
            task: messages.taskMissingError,
        };

        const inlineFeedItemErrorMessage = activeFeedEntryType
            ? errorMessageByEntryType[activeFeedEntryType]
            : undefined;

        const isInlineFeedItemErrorVisible = !isLoading && activeFeedEntryType && !activeFeedItem;

        return (
            // eslint-disable-next-line
            <div className="bcs-activity-feed" data-testid="activityfeed" onKeyDown={this.onKeyDown}>
                <div
                    ref={ref => {
                        this.feedContainer = ref;
                    }}
                    className="bcs-activity-feed-items-container"
                >
                    {isLoading && (
                        <div className="bcs-activity-feed-loading-state">
                            <LoadingIndicator />
                        </div>
                    )}

                    {isEmpty && !isLoading && (
                        <EmptyState
                            showAnnotationMessage={hasAnnotationCreatePermission}
                            showCommentMessage={showCommentForm}
                        />
                    )}
                    {!isEmpty && !isLoading && (
                        <ActiveState
                            {...activityFeedError}
                            activeFeedItem={activeFeedItem}
                            activeFeedItemRef={this.activeFeedItemRef}
                            approverSelectorContacts={approverSelectorContacts}
                            currentFileVersionId={currentFileVersionId}
                            currentUser={currentUser}
                            getApproverWithQuery={getApproverWithQuery}
                            getAvatarUrl={getAvatarUrl}
                            getMentionWithQuery={getMentionWithQuery}
                            getUserProfileUrl={getUserProfileUrl}
                            hasReplies={hasReplies}
                            hasVersions={hasVersions}
                            isDisabled={isDisabled}
                            items={collapseFeedState(feedItems)}
                            mentionSelectorContacts={mentionSelectorContacts}
                            onAnnotationDelete={onAnnotationDelete}
                            onAnnotationEdit={onAnnotationEdit}
                            onAnnotationSelect={onAnnotationSelect}
                            onAnnotationStatusChange={onAnnotationStatusChange}
                            onAppActivityDelete={onAppActivityDelete}
                            onCommentDelete={hasCommentPermission ? onCommentDelete : noop}
                            onCommentEdit={hasCommentPermission ? onCommentUpdate : noop}
                            onHideReplies={onHideReplies}
                            onReplyCreate={hasCommentPermission ? onReplyCreate : noop}
                            onReplyDelete={hasCommentPermission ? onReplyDelete : noop}
                            onReplyUpdate={hasCommentPermission ? onReplyUpdate : noop}
                            onShowReplies={onShowReplies}
                            onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                            onTaskDelete={onTaskDelete}
                            onTaskEdit={onTaskUpdate}
                            onTaskModalClose={onTaskModalClose}
                            onTaskView={onTaskView}
                            onVersionInfo={onVersionHistoryClick ? this.openVersionHistoryPopup : null}
                            translations={translations}
                        />
                    )}
                    {isInlineFeedItemErrorVisible && inlineFeedItemErrorMessage && (
                        <InlineError
                            title={<FormattedMessage {...messages.feedInlineErrorTitle} />}
                            className="bcs-feedItemInlineError"
                        >
                            <FormattedMessage {...inlineFeedItemErrorMessage} />
                        </InlineError>
                    )}
                </div>

                {showCommentForm ? (
                    <CommentForm
                        onSubmit={this.resetFeedScroll}
                        isDisabled={isDisabled}
                        mentionSelectorContacts={mentionSelectorContacts}
                        contactsLoaded={contactsLoaded}
                        className={classNames('bcs-activity-feed-comment-input', {
                            'bcs-is-disabled': isDisabled,
                        })}
                        createComment={hasCommentPermission ? this.onCommentCreate : noop}
                        getMentionWithQuery={getMentionWithQuery}
                        isOpen={isInputOpen}
                        // $FlowFixMe
                        user={currentUser}
                        onCancel={this.commentFormCancelHandler}
                        onFocus={this.commentFormFocusHandler}
                        getAvatarUrl={getAvatarUrl}
                    />
                ) : null}
            </div>
        );
    }
}

export default ActivityFeed;
