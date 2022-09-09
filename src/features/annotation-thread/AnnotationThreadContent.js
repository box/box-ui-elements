// @flow
import React from 'react';
import debounce from 'lodash/debounce';
import flow from 'lodash/flow';
import noop from 'lodash/noop';
import ActivityThread from '../../elements/content-sidebar/activity-feed/activity-feed/ActivityThread';
import AnnotationActivity from '../../elements/content-sidebar/activity-feed/annotations';
import API from '../../api/APIFactory';
import commonMessages from '../../elements/common/messages';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import { DEFAULT_COLLAB_DEBOUNCE } from '../../constants';
import { withAPIContext } from '../../elements/common/api-context';
import withErrorHandling from '../../elements/content-sidebar/withErrorHandling';

import type { Annotation, AnnotationPermission } from '../../common/types/annotations';
import type { ElementOrigin, ElementsErrorCallback, ElementsXhrError } from '../../common/types/api';
import type { FeedItemStatus } from '../../common/types/feed';
import type { BoxItemPermission, SelectorItems } from '../../common/types/core';
import type { Collaborators } from '../../elements/content-sidebar/flowTypes';

type Props = {
    annotationId: string,
    api: API,
    fileId: string,
    filePermissions: BoxItemPermission,
    onError: (error: ElementsXhrError | Error, code: string, contextInfo?: Object, origin?: ElementOrigin) => void,
};

const AnnotationThreadContent = ({ annotationId, api, fileId, filePermissions, onError }: Props) => {
    const [mentionSelectorContacts, setMentionSelectorContacts] = React.useState();
    const [annotation, setAnnotation] = React.useState();
    const [annotationError, setAnnotationError] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);

    const getAnnotationSuccess = (fetchedAnnotation: Annotation): void => {
        setAnnotation(fetchedAnnotation);
        setAnnotationError(undefined);
        setIsLoading(false);
    };

    const errorCallback = (error: ElementsXhrError, code: string, contextInfo: Object = {}): void => {
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */
        onError && onError(error, code, contextInfo);
    };

    const annotationErrorCallback = (e: ElementsXhrError, code: string) => {
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
    };

    const fetchAnnotation = () => {
        api.getAnnotationsAPI(false).getAnnotation(
            fileId,
            annotationId,
            filePermissions,
            getAnnotationSuccess,
            annotationErrorCallback,
            true,
        );
    };

    React.useEffect(() => {
        fetchAnnotation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [annotationId]);

    const annotationSuccessCallback = () => {
        fetchAnnotation();
    };

    const handleAnnotationDelete = ({ id, permissions }: { id: string, permissions: AnnotationPermission }) => {
        api.getAnnotationsAPI(false).deleteAnnotation(fileId, id, permissions, noop, annotationErrorCallback);
    };

    const handleAnnotationEdit = (id: string, text: string, permissions: AnnotationPermission) => {
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

    /**
     * Fetches file collaborators
     *
     * @param {Function} successCallback - the success callback
     * @param {Function} onErrorCallback - the error callback
     * @param {string} searchStr - the search string
     * @param {Object} [options]
     * @param {boolean} [options.includeGroups] - return groups as well as users
     * @return {void}
     */
    const getCollaborators = (
        successCallback: Collaborators => void,
        onErrorCallback: ElementsErrorCallback,
        searchStr: string,
        { includeGroups = false }: { includeGroups: boolean } = {},
    ): void => {
        // Do not fetch without filter
        if (!searchStr || searchStr.trim() === '') {
            return;
        }

        api.getFileCollaboratorsAPI(true).getFileCollaborators(fileId, successCallback, onErrorCallback, {
            filter_term: searchStr,
            include_groups: includeGroups,
            include_uploader_collabs: false,
        });
    };

    /**
     * Fetches file @mention's
     *
     * @private
     * @param {string} searchStr - Search string to filter file collaborators by
     * @return {void}
     */
    const getMentionWithQuery = debounce(
        (searchStr: string) => getCollaborators(getMentionContactsSuccessCallback, errorCallback, searchStr),
        DEFAULT_COLLAB_DEBOUNCE,
    );

    const getAvatarUrl = async (userId: string): Promise<?string> => {
        return api.getUsersAPI(false).getAvatarUrlWithAccessToken(userId, fileId);
    };

    const getUserProfileUrl = (userID: string) => Promise.resolve(`/profile/${userID}`);

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
                    getMentionWithQuery={getMentionWithQuery}
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

export default flow([withAPIContext, withErrorHandling])(AnnotationThreadContent);
