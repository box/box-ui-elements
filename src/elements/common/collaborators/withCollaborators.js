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

export default function withCollaborators(WrappedComponent: React.ComponentType<Props>): React.ComponentType<Props> {
    class WithMentions extends React.Component<Props> {
        static displayName: ?string;

        props: Props;

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
        getCollaborators = (
            fileId,
            successCallback: Collaborators => void,
            errorCallback: ElementsErrorCallback,
            searchStr: string,
            { includeGroups = false }: { includeGroups: boolean } = {},
        ) => {
            const { api } = this.props;
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
        getCollaboratorsWithQuery = debounce(
            (
                fileId: string,
                successCallback,
                errorCallback,
                searchStr: string,
                { includeGroups = false }: { includeGroups: boolean } = {},
            ) => {
                this.getCollaborators(fileId, successCallback, errorCallback, searchStr, { includeGroups });
            },
            DEFAULT_COLLAB_DEBOUNCE,
        );

        render() {
            return <WrappedComponent {...this.props} getCollaboratorsWithQuery={this.getCollaboratorsWithQuery} />;
        }
    }

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithMentions.displayName = `WithCollaborators(${displayName})`;

    return WithMentions;
}
