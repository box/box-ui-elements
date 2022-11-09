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
    PERMISSION_CAN_CREATE_ANNOTATIONS,
} from '../../../../constants';
import { scrollIntoView } from '../../../../utils/dom';
import type { ElementsXhrError } from '../../../../common/types/api';
import type {
    Annotation,
    AnnotationPermission,
    BoxCommentPermission,
    Comment,
    CommentFeedItemType,
    FocusableFeedItemType,
    FeedItem,
    FeedItems,
    FeedItemStatus,
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
    getComment?: (
        id: string,
        onSuccess: (comment: Comment) => void,
        onError: (error: ElementsXhrError, code: string, contextInfo?: Object) => void,
    ) => void,
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
    activeEntry?: FeedItem | null,
    isInputOpen: boolean,
    isReplyDataLoading: boolean,
};

class ActivityFeed extends React.Component<Props, State> {
    state = {
        activeEntry: undefined,
        isInputOpen: false,
        isReplyDataLoading: false,
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
        const { feedItems: currFeedItems, activeFeedEntryId, onShowReplies = noop } = this.props;
        const { activeEntry, isInputOpen: prevIsInputOpen } = prevState;
        const { activeEntry: prevActiveEntry, isInputOpen: currIsInputOpen } = this.state;

        const hasLoaded = this.hasLoaded(prevCurrentUser, prevFeedItems);
        const hasMoreItems = prevFeedItems && currFeedItems && prevFeedItems.length < currFeedItems.length;
        const didLoadFeedItems = prevFeedItems === undefined && currFeedItems !== undefined;
        const hasInputOpened = currIsInputOpen !== prevIsInputOpen;
        const hasActiveFeedEntryIdChanged = activeFeedEntryId !== prevActiveFeedEntryId;
        const hasActiveEntryChanged = activeEntry?.id !== prevActiveEntry?.id;

        if ((hasLoaded || hasMoreItems || didLoadFeedItems || hasInputOpened) && activeFeedEntryId === undefined) {
            this.resetFeedScroll();
        }

        if (hasActiveEntryChanged) {
            this.scrollToActiveFeedItemOrErrorMessage();
        }

        if (didLoadFeedItems || hasActiveFeedEntryIdChanged) {
            this.getActiveEntry((activeItem, repliesNeedToBeLoaded = false) => {
                if (
                    repliesNeedToBeLoaded &&
                    activeItem &&
                    (activeItem.type === FEED_ITEM_TYPE_ANNOTATION || activeItem.type === FEED_ITEM_TYPE_COMMENT)
                ) {
                    onShowReplies(activeItem.id, activeItem.type);
                }

                this.setState({ activeEntry: activeItem });
            });
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

    getActiveEntry = (callback: (activeEntry: FeedItem | null, repliesNeedToBeLoaded?: boolean) => void) => {
        const { activeFeedEntryId, activeFeedEntryType, feedItems, getComment, hasReplies } = this.props;

        if (!activeFeedEntryId || !Array.isArray(feedItems)) {
            return callback(null);
        }

        const firstLevelItem = feedItems.find(
            ({ id, type }) => id === activeFeedEntryId && type === activeFeedEntryType,
        );
        // If the active entry is a first level Feed item, return it
        if (firstLevelItem) {
            return callback(firstLevelItem);
        }

        // Check if hasReplies is enabled and active entry's type is comment
        if (!hasReplies || activeFeedEntryType !== FEED_ITEM_TYPE_COMMENT) {
            return callback(null);
        }

        const firstLevelItemWithActiveReply = feedItems.find(item => {
            if (
                (item.type !== FEED_ITEM_TYPE_ANNOTATION && item.type !== FEED_ITEM_TYPE_COMMENT) ||
                !item.replies ||
                !Array.isArray(item.replies)
            ) {
                return false;
            }
            return item.replies.some(({ id }) => id === activeFeedEntryId);
        });
        // If the active entry is within present replies of any first level Feed items (if it's a comment or annotation),
        // return that first level Feed item
        if (firstLevelItemWithActiveReply) {
            return callback(firstLevelItemWithActiveReply);
        }

        if (!getComment) {
            return callback(null);
        }

        this.setState({ isReplyDataLoading: true });
        return getComment(
            activeFeedEntryId,
            ({ parent }) => {
                this.setState({ isReplyDataLoading: false });
                const parentItem = feedItems.find(({ id }) => id === parent?.id) || null;
                callback(parentItem, true);
            },
            () => {
                this.setState({ isReplyDataLoading: false });
                callback(null);
            },
        );
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
        const { activeEntry, isInputOpen, isReplyDataLoading } = this.state;
        const hasAnnotationCreatePermission = getProp(file, ['permissions', PERMISSION_CAN_CREATE_ANNOTATIONS], false);
        const hasCommentPermission = getProp(file, 'permissions.can_comment', false);
        const showCommentForm = !!(currentUser && hasCommentPermission && onCommentCreate && feedItems);

        const isEmpty = this.isEmpty(this.props);
        const isLoading = !this.hasLoaded();

        const errorMessageByEntryType = {
            annotation: messages.annotationMissingError,
            comment: messages.commentMissingError,
            task: messages.taskMissingError,
        };

        const inlineFeedItemErrorMessage = activeFeedEntryType
            ? errorMessageByEntryType[activeFeedEntryType]
            : undefined;

        const isInlineFeedItemErrorVisible = !isLoading && activeFeedEntryType && activeEntry === null;
        const currentFileVersionId = getProp(file, 'file_version.id');

        return (
            // eslint-disable-next-line
            <div className="bcs-activity-feed" data-testid="activityfeed" onKeyDown={this.onKeyDown}>
                <div
                    ref={ref => {
                        this.feedContainer = ref;
                    }}
                    className="bcs-activity-feed-items-container"
                >
                    {(isLoading || isReplyDataLoading) && (
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
                            activeFeedEntryId={activeEntry?.id}
                            activeFeedEntryType={activeEntry?.type}
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
