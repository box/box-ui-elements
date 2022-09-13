// @flow
import React from 'react';
import flow from 'lodash/flow';
import ActivityThread from '../../elements/content-sidebar/activity-feed/activity-feed/ActivityThread';
import AnnotationActivity from '../../elements/content-sidebar/activity-feed/annotations';
import API from '../../api/APIFactory';
import commonMessages from '../../elements/common/messages';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import { withAPIContext } from '../../elements/common/api-context';
import withErrorHandling from '../../elements/content-sidebar/withErrorHandling';
import withCollaborators from '../../elements/common/collaborators/withCollaborators';

import type { Annotation, AnnotationPermission } from '../../common/types/annotations';
import type { ElementOrigin, ElementsXhrError } from '../../common/types/api';
import type { FeedItemStatus } from '../../common/types/feed';
import type { GetProfileUrlCallback } from '../../elements/common/flowTypes';
import type { BoxItemPermission, SelectorItems } from '../../common/types/core';

type Props = {
    annotationId: string,
    api: API,
    fileId: string,
    filePermissions: BoxItemPermission,
    getCollaboratorsWithQuery: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    onError: (error: ElementsXhrError | Error, code: string, contextInfo?: Object, origin?: ElementOrigin) => void,
};

const AnnotationThreadContent = ({
    annotationId,
    api,
    fileId,
    getCollaboratorsWithQuery,
    getUserProfileUrl,
    filePermissions,
    onError,
}: Props) => {
    const [mentionSelectorContacts, setMentionSelectorContacts] = React.useState();
    const [annotation, setAnnotation] = React.useState();
    const [annotationError, setAnnotationError] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);

    const getAnnotationSuccess = (fetchedAnnotation: Annotation): void => {
        setAnnotation(fetchedAnnotation);
        setAnnotationError(undefined);
        setIsLoading(false);
    };

    const errorCallback = React.useCallback(
        (error: ElementsXhrError, code: string, contextInfo: Object = {}): void => {
            /* eslint-disable no-console */
            console.error(error);
            /* eslint-enable no-console */
            onError && onError(error, code, contextInfo);
        },
        [onError],
    );

    const annotationErrorCallback = React.useCallback(
        (e: ElementsXhrError, code: string) => {
            setAnnotation(undefined);
            setIsLoading(false);
            setAnnotationError({
                maskError: {
                    errorHeader: commonMessages.defaultErrorMaskHeaderMessage,
                    errorSubHeader: commonMessages.defaultErrorMaskSubHeaderMessage,
                },
            });

            errorCallback(e, code, {
                error: e,
            });
        },
        [errorCallback],
    );

    const fetchAnnotation = React.useCallback(() => {
        api.getAnnotationsAPI(false).getAnnotation(
            fileId,
            annotationId,
            filePermissions,
            getAnnotationSuccess,
            annotationErrorCallback,
            true,
        );
    }, [annotationErrorCallback, annotationId, api, fileId, filePermissions]);

    React.useEffect(() => {
        fetchAnnotation();
    }, [annotationId, fetchAnnotation]);

    const annotationSuccessCallback = () => {
        setAnnotation({ ...annotation, isPendind: false });
        fetchAnnotation();
    };

    const annotationDeleteSuccessCallback = () => {
        setAnnotation({ ...annotation, isPendind: false });
    };

    const handleAnnotationDelete = ({ id, permissions }: { id: string, permissions: AnnotationPermission }) => {
        setAnnotation({ ...annotation, isPendind: true });
        api.getAnnotationsAPI(false).deleteAnnotation(
            fileId,
            id,
            permissions,
            annotationDeleteSuccessCallback,
            annotationErrorCallback,
        );
    };

    const handleAnnotationEdit = (id: string, text: string, permissions: AnnotationPermission) => {
        setAnnotation({ ...annotation, isPendind: true });
        api.getAnnotationsAPI(false).updateAnnotation(
            fileId,
            id,
            permissions,
            { message: text },
            annotationSuccessCallback,
            annotationErrorCallback,
        );
    };

    const handleAnnotationResolve = (id: string, status: FeedItemStatus, permissions: AnnotationPermission) => {
        setAnnotation({ ...annotation, isPendind: true });
        api.getAnnotationsAPI(false).updateAnnotation(
            fileId,
            id,
            permissions,
            { status },
            annotationSuccessCallback,
            annotationErrorCallback,
        );
    };

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
        getCollaboratorsWithQuery(fileId, getMentionContactsSuccessCallback, errorCallback, searchStr);

    const getAvatarUrl = async (userId: string): Promise<?string> => {
        return api.getUsersAPI(false).getAvatarUrlWithAccessToken(userId, fileId);
    };

    if (annotationError) {
        return null;
    }

    return (
        <ActivityThread hasReplies>
            {isLoading && <LoadingIndicator />}
            {!isLoading && !annotationError && annotation && (
                <AnnotationActivity
                    getAvatarUrl={getAvatarUrl}
                    isCurrentVersion
                    item={annotation}
                    getUserProfileUrl={getUserProfileUrl}
                    getMentionWithQuery={getMentions}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onEdit={handleAnnotationEdit}
                    onDelete={handleAnnotationDelete}
                    onResolve={handleAnnotationResolve}
                />
            )}
        </ActivityThread>
    );
};

export { AnnotationThreadContent as AnnotationThreadContentComponent };

export default flow([withCollaborators, withAPIContext, withErrorHandling])(AnnotationThreadContent);
