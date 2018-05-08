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
        return `${this.getBaseApiUrl()}/users/${userId}?fields=login,avatar_url,name`;
    }
}

export default Users;
