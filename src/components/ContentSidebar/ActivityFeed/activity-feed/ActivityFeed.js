/**
 * @flow
 * @file Component for Activity feed
 */

import React, { Component } from 'react';

import ApprovalCommentForm from '../approval-comment-form';
import Comment from '../comment';
import Task from '../task';
import Version, { CollapsedVersion, VersionError } from '../version';
import Keywords from '../keywords';
import EmptyState from './EmptyState';

import './ActivityFeed.scss';
import type { User } from '../../../../flowTypes';
import { Comments, Tasks, Contacts, Versions, SelectorItems, Item, Translations } from '../activityFeedFlowTypes';

type ActiveStateParams = {
    currentUser: User,
    handlers: {
        comments: Comments,
        tasks: Tasks,
        contacts: Contacts,
        versions: Versions
    },
    inputState: InputState,
    items: Array<Item>,
    onCommentDelete?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onVersionInfo?: Function,
    translations: Translations
};

const ActiveState = ({
    currentUser,
    items,
    onCommentDelete,
    onTaskDelete,
    onTaskEdit,
    onTaskAssignmentUpdate,
    onVersionInfo,
    translations,
    inputState,
    handlers
}: ActiveStateParams) => (
    <ul className='box-ui-activity-feed-active-state'>
        {items.map((item) => {
            switch (item.type) {
                case 'comment':
                    return (
                        <li className='box-ui-activity-feed-comment' key={item.type + item.id}>
                            <Comment
                                id={item.id}
                                currentUser={currentUser}
                                onDelete={onCommentDelete}
                                {...item}
                                translations={translations}
                                inputState={inputState}
                                handlers={handlers}
                            />
                        </li>
                    );
                case 'task':
                    return (
                        <li className='box-ui-activity-feed-task' key={item.type + item.id}>
                            <Task
                                currentUser={currentUser}
                                {...item}
                                onDelete={onTaskDelete}
                                onEdit={onTaskEdit}
                                onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                                translations={translations}
                                inputState={inputState}
                                handlers={handlers}
                            />
                        </li>
                    );
                case 'file_version':
                    return (
                        <li className='box-ui-version-item' key={item.type + item.id}>
                            {item.versions ? (
                                <CollapsedVersion {...item} onInfo={onVersionInfo} />
                            ) : (
                                <Version {...item} onInfo={onVersionInfo} />
                            )}
                        </li>
                    );
                case 'file_version_error':
                    // we currently only display this if errorCode is tooManyVersions
                    if (item.errorCode !== 'tooManyVersions') {
                        return null;
                    }
                    return (
                        <li className='box-ui-version-item' key={item.type + item.errorCode}>
                            {<VersionError {...item} />}
                        </li>
                    );
                case 'keywords':
                    return (
                        <li className='box-ui-keywords-item' key={item.type + item.id}>
                            {<Keywords {...item} />}
                        </li>
                    );
                default:
                    return null;
            }
        })}
    </ul>
);

function collapseFeedState(feedState) {
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

function shouldShowEmptyState(feedState) {
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

    onKeyDown = (event) => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = () => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = () => this.setState({ isInputOpen: false });
    approvalCommentFormSubmitHandler = () => this.setState({ isInputOpen: false });
    createCommentHandler = (args) => {
        const { handlers } = this.props;
        handlers.comments.create(args);
        this.approvalCommentFormSubmitHandler();
    };
    createTaskHandler = (args) => {
        const { handlers } = this.props;
        handlers.tasks.create(args);
        this.approvalCommentFormSubmitHandler();
    };

    render() {
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
            <div className='box-ui-activity-feed' onKeyDown={this.onKeyDown}>
                <div
                    ref={(ref) => {
                        this.feedContainer = ref;
                    }}
                    className='box-ui-activity-feed-items-container'
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
                        className={`box-ui-activity-feed-comment-input ${inputState.isDisabled ? 'is-disabled' : ''}`}
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
