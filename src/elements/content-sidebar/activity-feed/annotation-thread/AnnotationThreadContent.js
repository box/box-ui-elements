// @flow
import React from 'react';
import ActivityError from '../common/activity-error';
import ActivityThread from '../activity-feed/ActivityThread';
import AnnotationActivity from '../annotations';
import API from '../../../../api/APIFactory';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';
import useAnnotationAPI from './useAnnotationAPI';

import type { BoxItemPermission, SelectorItems } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';

import './AnnotationThreadContent.scss';

type Props = {
    annotationId: string,
    api: API,
    fileId: string,
    filePermissions: BoxItemPermission,
    onError: ErrorContextProps.onError,
};

const AnnotationThreadContent = ({ annotationId, api, fileId, filePermissions, onError }: Props) => {
    const [mentionSelectorContacts, setMentionSelectorContacts] = React.useState([]);

    const { annotation, isLoading, error, handleEdit, handleStatusChange, handleDelete } = useAnnotationAPI({
        api,
        fileId,
        annotationId,
        filePermissions,
        errorCallback: onError,
    });

    /**
     * File @mention contacts fetch success callback
     *
     * @private
     * @param {BoxItemCollection} collaborators - Collaborators response data
     * @return {void}
     */
    const getMentionContactsSuccessCallback = ({ entries }: { entries: SelectorItems<> }): void => {
        setMentionSelectorContacts(entries);
    };

    const getMentions = (searchStr: string) =>
        api
            .getFileCollaboratorsAPI(false)
            .getCollaboratorsWithQuery(fileId, getMentionContactsSuccessCallback, onError, searchStr);

    const getAvatarUrl = async (userId: string): Promise<?string> => {
        return api.getUsersAPI(false).getAvatarUrlWithAccessToken(userId, fileId);
    };

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
                    getMentionWithQuery={getMentions}
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
