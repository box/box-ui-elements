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
import { PERMISSION_CAN_CREATE_ANNOTATIONS } from '../../../../constants';
import { scrollIntoView } from '../../../../utils/dom';
import type { Annotation, AnnotationPermission, FocusableFeedItemType, FeedItems } from '../../../../common/types/feed';
import type { SelectorItems, User, GroupMini, BoxItem } from '../../../../common/types/core';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations, Errors } from '../../flowTypes';
import './ActivityFeed.scss';

type Props = {
    activeFeedEntryId?: string,
    activeFeedEntryType?: FocusableFeedItemType,
    activityFeedError: ?Errors,
    approverSelectorContacts?: SelectorItems<User | GroupMini>,
    currentUser?: User,
    feedItems?: FeedItems,
    file: BoxItem,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    isDisabled?: boolean,
    mentionSelectorContacts?: SelectorItems<User>,
    onAnnotationDelete?: ({ id: string, permissions: AnnotationPermission }) => void,
    onAnnotationSelect?: (annotation: Annotation) => void,
    onAppActivityDelete?: Function,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onCommentUpdate?: Function,
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

    render(): React.Node {
        const {
            activeFeedEntryId,
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
            isDisabled,
            mentionSelectorContacts,
            onAnnotationDelete,
            onAnnotationSelect,
            onAppActivityDelete,
            onCommentCreate,
            onCommentDelete,
            onCommentUpdate,
            onTaskAssignmentUpdate,
            onTaskDelete,
            onTaskModalClose,
            onTaskUpdate,
            onTaskView,
            onVersionHistoryClick,
            translations,
        } = this.props;
        const { isInputOpen } = this.state;
        const hasAnnotationCreatePermission = getProp(file, ['permissions', PERMISSION_CAN_CREATE_ANNOTATIONS], false);
        const hasCommentPermission = getProp(file, 'permissions.can_comment', false);
        const showCommentForm = !!(currentUser && hasCommentPermission && onCommentCreate && feedItems);

        const isEmpty = this.isEmpty(this.props);
        const isLoading = !this.hasLoaded();

        const activeEntry =
            Array.isArray(feedItems) &&
            feedItems.find(({ id, type }) => id === activeFeedEntryId && type === activeFeedEntryType);

        const errorMessageByEntryType = {
            annotation: messages.annotationMissingError,
            comment: messages.commentMissingError,
            task: messages.taskMissingError,
        };

        const inlineFeedItemErrorMessage = activeFeedEntryType
            ? errorMessageByEntryType[activeFeedEntryType]
            : undefined;

        const isInlineFeedItemErrorVisible = !isLoading && activeFeedEntryType && !activeEntry;
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
                            items={collapseFeedState(feedItems)}
                            isDisabled={isDisabled}
                            currentUser={currentUser}
                            currentFileVersionId={currentFileVersionId}
                            onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                            onAnnotationDelete={onAnnotationDelete}
                            onAnnotationSelect={onAnnotationSelect}
                            onAppActivityDelete={onAppActivityDelete}
                            onCommentDelete={hasCommentPermission ? onCommentDelete : noop}
                            onCommentEdit={hasCommentPermission ? onCommentUpdate : noop}
                            onTaskDelete={onTaskDelete}
                            onTaskEdit={onTaskUpdate}
                            onTaskView={onTaskView}
                            onTaskModalClose={onTaskModalClose}
                            onVersionInfo={onVersionHistoryClick ? this.openVersionHistoryPopup : null}
                            translations={translations}
                            getAvatarUrl={getAvatarUrl}
                            getUserProfileUrl={getUserProfileUrl}
                            mentionSelectorContacts={mentionSelectorContacts}
                            getMentionWithQuery={getMentionWithQuery}
                            approverSelectorContacts={approverSelectorContacts}
                            getApproverWithQuery={getApproverWithQuery}
                            activeFeedEntryId={activeFeedEntryId}
                            activeFeedEntryType={activeFeedEntryType}
                            activeFeedItemRef={this.activeFeedItemRef}
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
