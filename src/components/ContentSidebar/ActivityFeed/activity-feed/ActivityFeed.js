/**
 * @flow
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';

import ActiveState from './ActiveState';
import ApprovalCommentForm from '../approval-comment-form';
import EmptyState from './EmptyState';
import { collapseFeedState } from './activityFeedUtils';
import messages from '../../../messages';
import './ActivityFeed.scss';

const VERSION_RESTORE_ACTION = 'restore';
const TASK_INCOMPLETE = 'incomplete';

type Props = {
    file: BoxItem,
    activityFeedError?: Errors,
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
    getAvatarUrl: (string) => Promise<?string>,
    getUserProfileUrl?: (string) => Promise<string>,
    feedItems?: FeedItems
};

type State = {
    isInputOpen: boolean
};

class ActivityFeed extends React.Component<Props, State> {
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

    onCommentCreate = ({ text, hasMention }: { text: string, hasMention: boolean }) => {
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
    onTaskCreate = ({ text, assignees, dueAt }: { text: string, assignees: SelectorItems, dueAt: string }): void => {
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

    /**
     * Adds a versions entry if the current file version was restored from a previous version
     *
     * @param {FileVersions} versions - API returned file versions for this file
     * @return {FileVersions} modified versions array including the version restore
     */
    addRestoredVersion(versions: FileVersions) {
        const { file } = this.props;
        const { restored_from, modified_at, file_version } = file;

        // Ensures restored version is only added on first feed loads
        const lastVersion = versions.total_count ? versions.entries[versions.total_count - 1] : {};
        if (restored_from && lastVersion.action !== VERSION_RESTORE_ACTION) {
            const restoredVersion = versions.entries.find((version) => version.id === restored_from.id);

            if (restoredVersion) {
                versions.entries.push({
                    ...restoredVersion,
                    // $FlowFixMe
                    id: file_version.id,
                    created_at: modified_at,
                    action: VERSION_RESTORE_ACTION
                });
                versions.total_count += 1;
            }
        }

        return versions;
    }

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
            feedItems,
            onCommentDelete,
            onTaskDelete,
            onTaskUpdate,
            onTaskAssignmentUpdate
        } = this.props;
        const { isInputOpen } = this.state;
        const hasCommentPermission = getProp(file, 'permissions.can_comment', false);
        const showApprovalCommentForm = !!(currentUser && hasCommentPermission && onCommentCreate);

        return (
            // eslint-disable-next-line
            <div className="bcs-activity-feed" onKeyDown={this.onKeyDown}>
                <div
                    ref={(ref) => {
                        this.feedContainer = ref;
                    }}
                    className='bcs-activity-feed-items-container'
                >
                    {!feedItems ? (
                        <EmptyState isLoading showCommentMessage={showApprovalCommentForm} />
                    ) : (
                        <ActiveState
                            {...activityFeedError}
                            items={collapseFeedState(feedItems)}
                            isDisabled={isDisabled}
                            currentUser={currentUser}
                            onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                            onCommentDelete={hasCommentPermission ? onCommentDelete : noop}
                            // We don't know task edit/delete specific permissions,
                            // but you must at least be able to comment to do these operations.
                            onTaskDelete={hasCommentPermission ? onTaskDelete : noop}
                            onTaskEdit={hasCommentPermission ? onTaskUpdate : noop}
                            onVersionInfo={onVersionHistoryClick ? this.openVersionHistoryPopup : null}
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
                        onSubmit={() => {
                            if (this.feedContainer) {
                                this.feedContainer.scrollTop = 0;
                            }
                        }}
                        isDisabled={isDisabled}
                        approverSelectorContacts={approverSelectorContacts}
                        mentionSelectorContacts={mentionSelectorContacts}
                        className={classNames('bcs-activity-feed-comment-input', {
                            'bcs-is-disabled': isDisabled
                        })}
                        createComment={hasCommentPermission ? this.onCommentCreate : noop}
                        createTask={hasCommentPermission ? this.onTaskCreate : noop}
                        updateTask={hasCommentPermission ? this.updateTask : noop}
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
