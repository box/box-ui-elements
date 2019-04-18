/**
 * @flow
 * @file Helper for the box Users API
 * @author Box
 */

import TokenService from '../utils/TokenService';
import { getTypedFileId } from '../utils/file';
import Base from './Base';
import { ERROR_CODE_FETCH_CURRENT_USER } from '../constants';

class Users extends Base {
    /**
     * API URL for Users
     *
     * @return {string} base url for users
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/users/me`;
    }

    /**
     * API URL for Users avatar
     *
     * @param {string} id - A box user id.
     * @return {string} base url for users
     */
    getAvatarUrl(id: string): string {
        if (!id) {
            throw new Error('Missing user id');
        }

        return `${this.getBaseApiUrl()}/users/${id}/avatar`;
    }

    /**
     * Gets authenticated user avatar URL from cache or by getting new token
     *
     * @param {string} userId the user id
     * @param {string} fileId the file id
     * @return {string} the user avatar URL string for a given user with access token attached
     */
    async getAvatarUrlWithAccessToken(userId: string, fileId: string): Promise<?string> {
        // treat cache as key-value pairs of { userId: avatarUrl }
        const cache = this.getCache();
        if (cache.has(userId)) {
            return cache.get(userId);
        }

        const accessToken: TokenLiteral = await TokenService.getReadToken(getTypedFileId(fileId), this.options.token);

        if (typeof accessToken === 'string') {
            const url = `${this.getAvatarUrl(userId)}?access_token=${accessToken}`;
            cache.set(userId, url);
            return url;
        }

        return null;
    }

    /**
     * API for fetching a user
     *
     * @param {string} id - a box file id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {Object} requestData - additional request data
     * @returns {Promise<void>}
     */
    getUser(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: Object = {},
    ): void {
        this.errorCode = ERROR_CODE_FETCH_CURRENT_USER;
        this.get({
            id,
            successCallback,
            errorCallback,
            requestData,
        });
    }
}

export default Users;
