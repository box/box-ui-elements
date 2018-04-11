/**
 * @flow
 * @file Component for Activity feed
 */

import React, { Component } from 'react';
import type { Node } from 'react';

import ActiveState from './ActiveState';
import ApprovalCommentForm from '../approval-comment-form';
import EmptyState from './EmptyState';
import type { User, SelectorItems } from '../../../../flowTypes';
import type { Comments, Tasks, Contacts, Versions, Item, Translations } from '../activityFeedFlowTypes';

import './ActivityFeed.scss';

function collapseFeedState(feedState: Array<Item>): Array<Item> {
    return feedState.reduce((collapsedFeedState, feedItem) => {
        const previousFeedItem = collapsedFeedState.pop();

        if (!previousFeedItem) {
            return collapsedFeedState.concat([feedItem]);
        }

        if (
            feedItem.type === 'file_version' &&
            previousFeedItem.type === 'file_version' &&
            feedItem.action === 'upload' &&
            previousFeedItem.action === 'upload'
        ) {
            const {
                createdBy: prevCreatedBy,
                versions = [previousFeedItem],
                versionStart = previousFeedItem.versionNumber,
                versionEnd = previousFeedItem.versionNumber
            } = previousFeedItem;
            const { action, createdBy, id, versionNumber } = feedItem;
            const collaborators = previousFeedItem.collaborators || {
                [prevCreatedBy.id]: { ...prevCreatedBy }
            };

            // add collaborators
            collaborators[createdBy.id] = { ...createdBy };

            return collapsedFeedState.concat([
                {
                    action,
                    collaborators,
                    id,
                    type: 'file_version',
                    versions: versions.concat([feedItem]),
                    versionStart: Math.min(versionStart, versionNumber),
                    versionEnd: Math.max(versionEnd, versionNumber)
                }
            ]);
        }

        return collapsedFeedState.concat([previousFeedItem, feedItem]);
    }, []);
}

function shouldShowEmptyState(feedState: Array<Item>): boolean {
    return feedState.length === 0 || (feedState.length === 1 && feedState[0].type === 'file_version');
}

type Props = {
    isLoading?: boolean,
    feedState: Array<Item>,
    inputState: {
        approverSelectorContacts?: SelectorItems,
        mentionSelectorContacts?: SelectorItems,
        currentUser: User,
        isDisabled?: boolean
    },
    handlers: {
        comments: Comments,
        tasks: Tasks,
        contacts: Contacts,
        versions: Versions
    },
    translations: Translations
};

type State = {
    isInputOpen: boolean
};

class ActivityFeed extends Component<Props, State> {
    static defaultProps = {
        isLoading: false,
        feedState: []
    };

    state = {
        isInputOpen: false
    };

    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = (): void => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = (): void => this.setState({ isInputOpen: false });
    approvalCommentFormSubmitHandler = (): void => this.setState({ isInputOpen: false });
    createCommentHandler = (args): void => {
        const { handlers } = this.props;
        handlers.comments.create(args);
        this.approvalCommentFormSubmitHandler();
    };
    createTaskHandler = (args): void => {
        const { handlers } = this.props;
        handlers.tasks.create(args);
        this.approvalCommentFormSubmitHandler();
    };

    render(): Node {
        const { feedState, handlers, inputState, isLoading, translations } = this.props;
        const { isInputOpen } = this.state;
        const { approverSelectorContacts, mentionSelectorContacts, currentUser } = inputState;
        const showApprovalCommentForm = !!(handlers && handlers.comments && handlers.comments.create);
        const onTaskAssignmentUpdate = handlers && handlers.tasks && handlers.tasks.onTaskAssignmentUpdate;
        const commentDeleteHandler = handlers && handlers.comments && handlers.comments.delete;
        const taskDeleteHandler = handlers && handlers.tasks && handlers.tasks.delete;
        const taskEditHandler = handlers && handlers.tasks && handlers.tasks.edit;
        const versionInfoHandler = handlers && handlers.versions && handlers.versions.info;

        return (
            // eslint-disable-next-line
            <div className="bcs-activity-feed" onKeyDown={this.onKeyDown}>
                <div
                    ref={(ref) => {
                        this.feedContainer = ref;
                    }}
                    className='bcs-activity-feed-items-container'
                >
                    {shouldShowEmptyState(feedState) ? (
                        <EmptyState isLoading={isLoading} showCommentMessage={showApprovalCommentForm} />
                    ) : (
                        <ActiveState
                            handlers={handlers}
                            items={collapseFeedState(feedState)}
                            currentUser={currentUser}
                            onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                            onCommentDelete={commentDeleteHandler}
                            onTaskDelete={taskDeleteHandler}
                            onTaskEdit={taskEditHandler}
                            onVersionInfo={versionInfoHandler}
                            translations={translations}
                            inputState={inputState}
                        />
                    )}
                </div>
                {showApprovalCommentForm ? (
                    <ApprovalCommentForm
                        onSubmit={() => {
                            this.feedContainer.scrollTop = 0;
                        }}
                        isDisabled={inputState.isDisabled}
                        approverSelectorContacts={approverSelectorContacts}
                        mentionSelectorContacts={mentionSelectorContacts}
                        className={`bcs-activity-feed-comment-input ${inputState.isDisabled ? 'bcs-is-disabled' : ''}`}
                        createComment={this.createCommentHandler}
                        createTask={handlers && handlers.tasks ? this.createTaskHandler : null}
                        getApproverContactsWithQuery={
                            handlers && handlers.contacts ? handlers.contacts.getApproverWithQuery : null
                        }
                        getMentionContactsWithQuery={
                            handlers && handlers.contacts ? handlers.contacts.getMentionWithQuery : null
                        }
                        isOpen={isInputOpen}
                        user={currentUser}
                        onCancel={this.approvalCommentFormCancelHandler}
                        onFocus={this.approvalCommentFormFocusHandler}
                    />
                ) : null}
            </div>
        );
    }
}

export default ActivityFeed;
