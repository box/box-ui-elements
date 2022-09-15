// @flow
import React from 'react';
import ActivityThread from '../activity-feed/ActivityThread';
import AnnotationActivity from '../annotations';
import API from '../../../../api/APIFactory';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';
import withCollaborators from '../../../common/collaborators/withCollaborators';

import type { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';
import type { BoxItemPermission, SelectorItems } from '../../../../common/types/core';
import type { WithCollaboratorsProps } from '../../../common/collaborators/withCollaborators';
import useAnnotationAPI from './useAnnotationAPI';

type Props = {
    annotationId: string,
    api: API,
    fileId: string,
    filePermissions: BoxItemPermission,
    onError: (error: ElementsXhrError | Error, code: string, contextInfo?: Object, origin?: ElementOrigin) => void,
} & WithCollaboratorsProps;

const AnnotationThreadContent = ({
    annotationId,
    api,
    fileId,
    getCollaboratorsWithQuery,
    filePermissions,
    onError,
}: Props) => {
    const [mentionSelectorContacts, setMentionSelectorContacts] = React.useState([]);

    const { annotation, isLoading, isError, handleEdit, handleResolve, handleDelete } = useAnnotationAPI({
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
    const getMentionContactsSuccessCallback = (collaborators: { entries: SelectorItems<> }): void => {
        setMentionSelectorContacts(collaborators.entries);
    };

    const getMentions = (searchStr: string) =>
        getCollaboratorsWithQuery(fileId, getMentionContactsSuccessCallback, onError, searchStr);

    const getAvatarUrl = async (userId: string): Promise<?string> => {
        return api.getUsersAPI(false).getAvatarUrlWithAccessToken(userId, fileId);
    };

    if (isError) {
        return null;
    }

    return (
        <ActivityThread hasReplies getAvatarUrl={getAvatarUrl}>
            {isLoading && (
                <div className="bcs-ActivityThreadContent-loading" data-testid="annotation-loading">
                    <LoadingIndicator />
                </div>
            )}
            {!isLoading && annotation && (
                <AnnotationActivity
                    getAvatarUrl={getAvatarUrl}
                    isCurrentVersion
                    item={annotation}
                    getMentionWithQuery={getMentions}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onResolve={handleResolve}
                />
            )}
        </ActivityThread>
    );
};

export { AnnotationThreadContent as AnnotationThreadContentComponent };

export default withCollaborators(AnnotationThreadContent);
