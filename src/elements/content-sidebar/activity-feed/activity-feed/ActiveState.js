/**
 * @flow
 * @file Active state component for Activity Feed
 */
import * as React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import InlineError from '../../../../components/inline-error/InlineError';
import AppActivity from '../app-activity';
import Comment from '../comment';
import TaskNew from '../task-new';
import Version, { CollapsedVersion } from '../version';
import Keywords from '../keywords';
import withErrorHandling from '../../withErrorHandling';
import type { FocusableFeedItemType } from '../../../../common/types/feed';
import messages from './messages';

const errorMessageByEntryType = {
    comment: messages.commentMissingError,
    task: messages.taskMissingError,
};

const hasErrorMessageForEntryType = feedEntryType => {
    return !!errorMessageByEntryType[feedEntryType];
};

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
            {items.map((item: any) => {
                const { type, id, versions, permissions } = item;
                const isFocused = item === activeEntry;
                const refValue = isFocused ? activeFeedItemRef : undefined;

                switch (type) {
                    case 'comment':
                        return (
                            <li
                                key={type + id}
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
                                        can_delete: getProp(permissions, 'can_delete', false),
                                        can_edit: getProp(permissions, 'can_edit', false),
                                    }}
                                    translations={translations}
                                />
                            </li>
                        );
                    case 'task':
                        return (
                            <li
                                key={type + id}
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
                            <li key={type + id} className="bcs-version-item" data-testid="version">
                                {versions ? (
                                    <CollapsedVersion {...item} onInfo={onVersionInfo} />
                                ) : (
                                    <Version {...item} onInfo={onVersionInfo} />
                                )}
                            </li>
                        );
                    case 'keywords':
                        return (
                            <li key={type + id} className="bcs-keywords-item" data-testid="keyword">
                                <Keywords {...item} />
                            </li>
                        );
                    case 'app_activity':
                        return (
                            <li key={type + id} className="bcs-activity-feed-app-activity" data-testid="app-activity">
                                <AppActivity currentUser={currentUser} onDelete={onAppActivityDelete} {...item} />
                            </li>
                        );
                    default:
                        return null;
                }
            })}

            {activeFeedEntryType && !activeEntry && hasErrorMessageForEntryType(activeFeedEntryType) ? (
                <li>
                    <InlineError title={<FormattedMessage {...messages.feedInlineErrorTitle} />}>
                        <FormattedMessage {...errorMessageByEntryType[activeFeedEntryType]} />
                    </InlineError>
                </li>
            ) : null}
        </ul>
    );
};

export { ActiveState as ActiveStateComponent };
export default withErrorHandling(ActiveState);
