/**
 * @flow
 * @file Active state component for Activity Feed
 */
import * as React from 'react';
import getProp from 'lodash/get';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import Comment from '../comment';
import Task from '../task';
import Version, { CollapsedVersion } from '../version';
import Keywords from '../keywords';
import withErrorHandling from '../../withErrorHandling';

type Props = {
    currentUser?: User,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: string => Promise<string>,
    items: FeedItems,
    mentionSelectorContacts?: SelectorItems,
    onCommentDelete?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onVersionInfo?: Function,
    translations?: Translations,
};

class ActiveState extends React.Component<Props> {
    cache: any;

    list: any;

    constructor() {
        super();
        this.cache = new CellMeasurerCache({
            defaultHeight: 81,
            fixedWidth: true,
        });
    }

    componentDidUpdate() {
        this.cache.clearAll();
        this.list.forceUpdateGrid();
    }

    renderActivityCard = ({ key, index, parent, style }: any) => {
        const {
            items,
            currentUser,
            getAvatarUrl,
            getUserProfileUrl,
            onCommentDelete,
            translations,
            getMentionWithQuery,
            mentionSelectorContacts,
            onTaskAssignmentUpdate,
            onTaskDelete,
            onTaskEdit,
            onVersionInfo,
        } = this.props;

        const item: any = items[index];
        const { type, id, versions, permissions } = item;
        switch (type) {
            case 'comment':
                return (
                    <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                        <li key={type + id} className="bcs-activity-feed-comment" style={style}>
                            <Comment
                                {...item}
                                cellMeasurerCache={this.cache}
                                currentUser={currentUser}
                                getAvatarUrl={getAvatarUrl}
                                getUserProfileUrl={getUserProfileUrl}
                                onDelete={onCommentDelete}
                                permissions={{
                                    can_delete: getProp(permissions, 'can_delete', false),
                                    can_edit: getProp(permissions, 'can_edit', false),
                                }}
                                translations={translations}
                            />
                        </li>
                    </CellMeasurer>
                );

            case 'task':
                return item.task_assignment_collection.total_count ? (
                    <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                        <li key={type + id} className="bcs-activity-feed-task" style={style}>
                            <Task
                                {...item}
                                currentUser={currentUser}
                                cellMeasurerCache={this.cache}
                                getAvatarUrl={getAvatarUrl}
                                getMentionWithQuery={getMentionWithQuery}
                                getUserProfileUrl={getUserProfileUrl}
                                mentionSelectorContacts={mentionSelectorContacts}
                                onAssignmentUpdate={onTaskAssignmentUpdate}
                                onDelete={onTaskDelete}
                                onEdit={onTaskEdit}
                                permissions={{
                                    can_delete: true,
                                    can_edit: true,
                                }}
                                // permissions are not part of task API so hard code to true
                                translations={translations}
                            />
                        </li>
                    </CellMeasurer>
                ) : null;
            case 'file_version':
                return (
                    <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                        <li key={type + id} className="bcs-version-item" style={style}>
                            {versions ? (
                                <CollapsedVersion {...item} onInfo={onVersionInfo} />
                            ) : (
                                <Version {...item} onInfo={onVersionInfo} />
                            )}
                        </li>
                    </CellMeasurer>
                );
            case 'keywords':
                return (
                    <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                        <li key={type + id} className="bcs-keywords-item" style={style}>
                            <Keywords {...item} />
                        </li>
                    </CellMeasurer>
                );
            default:
                return null;
        }
    };

    render = (): React.Node => (
        <ul className="bcs-activity-feed-active-state">
            <AutoSizer disableWidth>
                {({ height }) => (
                    <List
                        ref={ref => {
                            this.list = ref;
                        }}
                        overscanRowCount={10}
                        className="bcs-activity-feed-active-state-content"
                        rowCount={this.props.items.length}
                        height={height}
                        rowHeight={this.cache.rowHeight}
                        rowRenderer={this.renderActivityCard}
                        width={340}
                    />
                )}
            </AutoSizer>
        </ul>
    );
}

export { ActiveState as ActiveStateComponent };
export default withErrorHandling(ActiveState);
