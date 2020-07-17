/**
 * @flow
 * @file Helper for the box Users API
 * @author Box
 */

import queryString from 'query-string';
import TokenService from '../utils/TokenService';
import { getTypedFileId } from '../utils/file';
import Base from './Base';
import { ERROR_CODE_FETCH_CURRENT_USER, ERROR_CODE_FETCH_ENTERPRISE_USERS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { TokenLiteral } from '../common/types/core';

class Users extends Base {
    /**
     * API URL for Users
     *
     * @returns {string} base url for users
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/users/me`;
    }

    /**
     * API URL for Users avatar
     *
     * @param {string} id - A box user id.
     * @returns {string} base url for users
     */
    getAvatarUrl(id: string): string {
        if (!id) {
            throw new Error('Missing user id');
        }

        return `${this.getBaseApiUrl()}/users/${id}/avatar`;
    }

    /**
     * API URL for fetching all users in the current user's enterprise
     *
     * @param {string} [filterTerm] Optional filter for enterprise users
     * @returns {string} URL for fetching enterprise users
     */
    getUsersInEnterpriseUrl(filterTerm: ?string): string {
        let url = `${this.getBaseApiUrl()}/users`;

        if (filterTerm) {
            const enterpriseUsersQuery = queryString.stringify({ filter_term: filterTerm });
            url = `${url}?${enterpriseUsersQuery}`;
        }

        return url;
    }

    /**
     * Gets authenticated user avatar URL from cache or by getting new token
     *
     * @param {string} userId the user id
     * @param {string} fileId the file id
     * @returns {string} the user avatar URL string for a given user with access token attached
     */
    async getAvatarUrlWithAccessToken(userId?: ?string, fileId: string): Promise<?string> {
        if (!userId) {
            return null;
        }

        // treat cache as key-value pairs of { userId: avatarUrl }
        const cache = this.getCache();
        if (cache.has(userId)) {
            return cache.get(userId);
        }

        const accessToken: TokenLiteral = await TokenService.getReadToken(getTypedFileId(fileId), this.options.token);

        if (typeof accessToken === 'string') {
            const options = {
                access_token: accessToken,
                pic_type: 'large',
            };
            const urlParams = queryString.stringify(options);
            const url = `${this.getAvatarUrl(userId)}?${urlParams}`;
            cache.set(userId, url);
            return url;
        }

        return null;
    }

    /**
     * API for fetching a user
     *
     * @param {string} id - a Box item id
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

    /**
     * API for fetching all users in the current user's enterprise
     *
     * @param {string} id - Box item ID
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {string} [filterTerm] - Optional filter for the users
     * @returns {void}
     */
    getUsersInEnterprise(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        filterTerm: ?string,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ENTERPRISE_USERS;
        this.get({
            id,
            successCallback,
            errorCallback,
            url: this.getUsersInEnterpriseUrl(filterTerm),
        });
    }
}

export default Users;
