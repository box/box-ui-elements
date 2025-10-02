/**
 * @flow
 * @file Helper for the Box Collaborations API
 * @author Box
 *
 * The Collaborations API is different from the other APIs related to collaborations/collaborators.
 * - The Item Collaborations (File Collaborations and Folder Collaborations) API only accepts GET requests for a single item;
 *   it returns an object containing all the users who are collaborated on that item.
 * - The File Collaborators API is used exclusively in the ContentSidebar UI Element.
 * - This API enables CRUD actions on a single collaboration for a single item. For more information, see the API docs at
 *   https://developer.box.com/reference/resources/collaboration/.
 */

import Base from './Base';
import type { BoxItem, Collaboration } from '../common/types/core';
import type { ElementsErrorCallback } from '../common/types/api';

class Collaborations extends Base {
    /**
     * API URL for collaborations
     *
     * @return {string} Base URL for collaborations
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/collaborations`;
    }

    /**
     * Add a collaboration for a single user or a single group to a file or folder.
     * Users can be added by ID or login (email); groups can only be added by ID.
     *
     * @param {BoxItem} item
     * @param {$Shape<Collaboration>} collaboration
     * @param {(data?: Object) => void} successCallback
     * @param {ElementsErrorCallback} errorCallback
     */
    addCollaboration = (
        item: BoxItem,
        collaboration: $Shape<Collaboration>,
        successCallback: (data?: Object) => void,
        errorCallback: ElementsErrorCallback,
    ): void => {
        const { id } = item;
        this.post({
            id,
            data: {
                data: {
                    item,
                    ...collaboration,
                },
            },
            errorCallback,
            successCallback,
            url: this.getUrl(),
        });
    };
}

export default Collaborations;
