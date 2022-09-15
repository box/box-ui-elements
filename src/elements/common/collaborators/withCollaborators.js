// @flow

import * as React from 'react';
import debounce from 'lodash/debounce';
import { DEFAULT_COLLAB_DEBOUNCE } from '../../../constants';
import API from '../../../api/APIFactory';
import type { Collaborators } from '../../content-sidebar/flowTypes';
import type { ElementsErrorCallback } from '../../../common/types/api';

type Props = {
    api: API,
};

export type WithCollaboratorsProps = {
    getCollaboratorsWithQuery: (
        fileId: string,
        successCallback: (Collaborators) => void,
        errorCallback: ElementsErrorCallback,
        searchStr: string,
        options?: { includeGroups?: boolean },
    ) => void,
};

const withCollaborators = (WrappedComponent: React.ComponentType<any>) => ({ api, ...rest }: Props) => {
    /**
     * Fetches file collaborators
     *
     * @param {string} fileId
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {string} searchStr - the search string
     * @param {Object} [options]
     * @param {boolean} [options.includeGroups] - return groups as well as users
     * @return {void}
     */
    const getCollaborators = (
        fileId,
        successCallback: Collaborators => void,
        errorCallback: ElementsErrorCallback,
        searchStr: string,
        { includeGroups = false }: { includeGroups: boolean } = {},
    ) => {
        // Do not fetch without filter
        if (!searchStr || searchStr.trim() === '') {
            return;
        }

        api.getFileCollaboratorsAPI(true).getFileCollaborators(fileId, successCallback, errorCallback, {
            filter_term: searchStr,
            include_groups: includeGroups,
            include_uploader_collabs: false,
        });
    };

    /**
     * Fetches file @mention's
     *
     * @private
     * @oaram {string} fileId
     * @param {Function} successCallback
     * @param {Function} errorCallback
     * @param {string} searchStr - Search string to filter file collaborators by
     * @param {Object} [options]
     * @param {boolean} [options.includeGroups] - return groups as well as users
     * @return {void}
     */
    const getCollaboratorsWithQuery = debounce(
        (
            fileId: string,
            successCallback: Collaborators => void,
            errorCallback: ElementsErrorCallback,
            searchStr: string,
            { includeGroups = false }: { includeGroups: boolean } = {},
        ) => {
            getCollaborators(fileId, successCallback, errorCallback, searchStr, { includeGroups });
        },
        DEFAULT_COLLAB_DEBOUNCE,
    );

    return <WrappedComponent {...rest} api={api} getCollaboratorsWithQuery={getCollaboratorsWithQuery} />;
};

export default withCollaborators;
