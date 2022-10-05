// @flow
import React from 'react';
import ActivityError from '../common/activity-error';
import ActivityThread from '../activity-feed/ActivityThread';
import AnnotationActivity from '../annotations';
import API from '../../../../api/APIFactory';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';
import useAnnotationAPI from './useAnnotationAPI';

import type { BoxItem, SelectorItems } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';

import './AnnotationThreadContent.scss';

type Props = {
    annotationId: string,
    api: API,
    file: BoxItem,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery: (searchStr: string) => void,
    mentionSelectorContacts: SelectorItems<>,
} & ErrorContextProps;

const AnnotationThreadContent = ({
    annotationId,
    api,
    file,
    getAvatarUrl,
    getMentionWithQuery,
    mentionSelectorContacts,
    onError,
}: Props) => {
    const { id: fileId, permissions = {} } = file;

    const { annotation, isLoading, error, handleEdit, handleStatusChange, handleDelete } = useAnnotationAPI({
        api,
        annotationId,
        fileId,
        filePermissions: permissions,
        errorCallback: onError,
    });

    return (
        <ActivityThread hasReplies getAvatarUrl={getAvatarUrl}>
            {error && <ActivityError {...error} />}
            {isLoading && (
                <div className="AnnotationThreadContent-loading" data-testid="annotation-loading">
                    <LoadingIndicator />
                </div>
            )}
            {annotation && (
                <AnnotationActivity
                    getAvatarUrl={getAvatarUrl}
                    isCurrentVersion
                    item={annotation}
                    getMentionWithQuery={getMentionWithQuery}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                />
            )}
        </ActivityThread>
    );
};

export default AnnotationThreadContent;
