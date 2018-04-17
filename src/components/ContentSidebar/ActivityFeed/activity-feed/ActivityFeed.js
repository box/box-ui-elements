/**
 * @flow
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';

import ActiveState from './ActiveState';
import ApprovalCommentForm from '../approval-comment-form';
import EmptyState from './EmptyState';
import { collapseFeedState, shouldShowEmptyState } from './activityFeedUtils';
import type { User, SelectorItems } from '../../../../flowTypes';
import type { Comments, Tasks, Contacts, Versions, Item, Translations } from '../activityFeedFlowTypes';

import './ActivityFeed.scss';

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

class ActivityFeed extends React.Component<Props, State> {
    static defaultProps = {
        isLoading: false,
        feedState: []
    };

    state = {
        isInputOpen: false
    };

    feedContainer: null | HTMLElement;

    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = (): void => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = (): void => this.setState({ isInputOpen: false });
    approvalCommentFormSubmitHandler = (): void => this.setState({ isInputOpen: false });
    createCommentHandler = (args: any): void => {
        const { handlers } = this.props;
        handlers.comments.create(args);
        this.approvalCommentFormSubmitHandler();
    };
    createTaskHandler = (args: any): void => {
        const { handlers } = this.props;
        handlers.tasks.create(args);
        this.approvalCommentFormSubmitHandler();
    };

    render(): React.Node {
        const { feedState, handlers, inputState, isLoading, translations } = this.props;
        const { isInputOpen } = this.state;
        const { approverSelectorContacts, mentionSelectorContacts, currentUser } = inputState;
        const showApprovalCommentForm = !!getProp(handlers, 'comments.create', false);
        const onTaskAssignmentUpdate = getProp(handlers, 'tasks.onTaskAssignmentUpdate');
        const commentDeleteHandler = getProp(handlers, 'comments.delete');
        const taskDeleteHandler = getProp(handlers, 'tasks.delete');
        const taskEditHandler = getProp(handlers, 'tasks.edit');
        const versionInfoHandler = getProp(handlers, 'versions.info');

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
                            if (this.feedContainer) {
                                this.feedContainer.scrollTop = 0;
                            }
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
