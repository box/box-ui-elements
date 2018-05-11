/**
 * @flow
 * @file Helper for the box Users API
 * @author Box
 */

import Base from './Base';

/**
 * Fields we want include:
 *  -
 */

class Users extends Base {
    /**
     * API URL for Users
     *
     * @param {string} [id] - A box user id. Defaults to 'me' if empty.
     * @return {string} base url for users
     */
    getUrl(id?: string): string {
        const userId = id || 'me';
        return `${this.getBaseApiUrl()}/users/${userId}`;
    }

    /**
     * API URL for Users avatar
     *
     * @param {string} [id] - A box user id.
     * @return {string} base url for users
     */
    getAvatarUrl(id: string): string {
        if (!id) {
            throw new Error('Missing user id');
        }
        return `${this.getUrl(id)}/avatar`;
    }
}

export default Users;
