/**
 * @flow
 * @file Active state component for Activity Feed
 */
import * as React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import AppActivity from '../app-activity';
import Comment from '../comment';
import TaskNew from '../task-new';
import Version, { CollapsedVersion } from '../version';
import withErrorHandling from '../../withErrorHandling';
import type { FocusableFeedItemType } from '../../../../common/types/feed';

type Props = {
    activeFeedEntryId?: string,
    activeFeedEntryType?: FocusableFeedItemType,
    activeFeedItemRef: { current: null | HTMLElement },
    approverSelectorContacts?: SelectorItems,
    currentUser?: User,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    items: FeedItems,
    mentionSelectorContacts?: SelectorItems,
    onAppActivityDelete?: Function,
    onCommentDelete?: Function,
    onCommentEdit?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onTaskModalClose?: Function,
    onVersionInfo?: Function,
    translations?: Translations,
};

const ActiveState = ({
    activeFeedEntryId,
    activeFeedEntryType,
    activeFeedItemRef,
    approverSelectorContacts,
    currentUser,
    items,
    mentionSelectorContacts,
    getMentionWithQuery,
    onAppActivityDelete,
    onCommentDelete,
    onCommentEdit,
    onTaskDelete,
    onTaskEdit,
    onTaskAssignmentUpdate,
    onTaskModalClose,
    onVersionInfo,
    translations,
    getApproverWithQuery,
    getAvatarUrl,
    getUserProfileUrl,
}: Props): React.Node => {
    const activeEntry = items.find(({ id, type }) => id === activeFeedEntryId && type === activeFeedEntryType);

    return (
        <ul className="bcs-activity-feed-active-state">
            {items.map((item: FeedItem) => {
                const isFocused = item === activeEntry;
                const refValue = isFocused ? activeFeedItemRef : undefined;

                switch (item.type) {
                    case 'comment':
                        return (
                            <li
                                key={item.type + item.id}
                                className={classNames('bcs-activity-feed-comment', { 'bcs-is-focused': isFocused })}
                                data-testid="comment"
                                ref={refValue}
                            >
                                <Comment
                                    {...item}
                                    currentUser={currentUser}
                                    getAvatarUrl={getAvatarUrl}
                                    getMentionWithQuery={getMentionWithQuery}
                                    getUserProfileUrl={getUserProfileUrl}
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    onDelete={onCommentDelete}
                                    onEdit={onCommentEdit}
                                    permissions={{
                                        can_delete: getProp(item.permissions, 'can_delete', false),
                                        can_edit: getProp(item.permissions, 'can_edit', false),
                                    }}
                                    translations={translations}
                                />
                            </li>
                        );
                    case 'task':
                        return (
                            <li
                                key={item.type + item.id}
                                className={classNames('bcs-activity-feed-task-new', { 'bcs-is-focused': isFocused })}
                                data-testid="task"
                                ref={refValue}
                            >
                                <TaskNew
                                    {...item}
                                    approverSelectorContacts={approverSelectorContacts}
                                    currentUser={currentUser}
                                    getApproverWithQuery={getApproverWithQuery}
                                    getAvatarUrl={getAvatarUrl}
                                    getUserProfileUrl={getUserProfileUrl}
                                    onAssignmentUpdate={onTaskAssignmentUpdate}
                                    onDelete={onTaskDelete}
                                    onEdit={onTaskEdit}
                                    onModalClose={onTaskModalClose}
                                    translations={translations}
                                />
                            </li>
                        );
                    case 'file_version':
                        return (
                            <li key={item.type + item.id} className="bcs-version-item" data-testid="version">
                                {item.versions ? (
                                    <CollapsedVersion {...item} onInfo={onVersionInfo} />
                                ) : (
                                    <Version {...item} onInfo={onVersionInfo} />
                                )}
                            </li>
                        );
                    case 'app_activity':
                        return (
                            <li
                                key={item.type + item.id}
                                className="bcs-activity-feed-app-activity"
                                data-testid="app-activity"
                            >
                                <AppActivity currentUser={currentUser} onDelete={onAppActivityDelete} {...item} />
                            </li>
                        );
                    default:
                        return null;
                }
            })}
        </ul>
    );
};

export { ActiveState as ActiveStateComponent };
export default withErrorHandling(ActiveState);
