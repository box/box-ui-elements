/**
 * @flow
 * @file Active state component for Activity Feed
 */
import * as React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import { type IntlShape } from 'react-intl';
import AppActivity from '../app-activity';
import Comment from '../comment';
import TaskNew from '../task-new';
import Version, { CollapsedVersion } from '../version';
import Keywords from '../keywords';
import withErrorHandling from '../../withErrorHandling';
import type { FocusableFeedItemType } from '../../../../common/types/feed';

type Props = {
    action: string | 'applied',
    activeFeedEntryId?: string,
    activeFeedEntryType?: FocusableFeedItemType,
    activeFeedItemRef: { current: null | HTMLElement },
    activity_template: ActivityTemplateItem,
    app: AppItem,
    approverSelectorContacts?: SelectorItems,
    created_at: string,
    created_by: User,

    currentUser?: User,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    intl: IntlShape,
    isFocused?: boolean,
    isPending: boolean,
    item: FeedItem,
    mentionSelectorContacts?: SelectorItems,
    onAppActivityDelete?: Function,
    onCommentDelete?: Function,
    onCommentEdit?: Function,
    onDelete: ({ id: string, permissions?: {} }) => void,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onTaskModalClose?: Function,
    onVersionInfo?: Function,
    rendered_text: string,
    translations?: Translations,
    words: string,
};

const ActivityFeedItem = React.forwardRef<Props, ?HTMLElement>(
    (
        {
            isPending,
            approverSelectorContacts,
            currentUser,
            item,
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
            isFocused,
            activeFeedItemRef,
        }: Props,
        ref,
    ): React.Node => {
        const { type, id, permissions } = item;
        if (!currentUser) return null;
        switch (type) {
            case 'comment':
                return (
                    <li
                        className={classNames('bcs-activity-feed-comment', { 'bcs-is-focused': isFocused })}
                        // { 'bcs-is-focused': isFocused }
                        data-testid="comment"
                        ref={activeFeedItemRef}
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
                        className={classNames('bcs-activity-feed-task-new', { 'bcs-is-focused': isFocused })}
                        data-testid="task"
                        ref={activeFeedItemRef}
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
                        {item.versions ? (
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
                        <AppActivity
                            // activity
                            // _template={activity_template}
                            // app={app}
                            // created_at={created_at}
                            // created_by={created_by}
                            // id={id}
                            // intl={intl}
                            isPending={isPending}
                            // rendered_text={rendered_text}
                            currentUser={currentUser}
                            onDelete={onAppActivityDelete}
                            {...item}
                        />
                    </li>
                );
            default:
                return null;
        }
    },
);

export { ActivityFeedItem as ActivityFeedComponent };
export default withErrorHandling(ActivityFeedItem);
