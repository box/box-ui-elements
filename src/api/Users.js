/**
 * @flow
 * @file Helper for the box Users API
 * @author Box
 */

import Base from './Base';
import TokenService from '../util/TokenService';
import { getTypedFileId } from '../util/file';
import type { TokenLiteral } from '../flowTypes';

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

    /**
     * Gets the user avatar URL
     *
     * @param {string} userId the user id
     * @return the user avatar URL string for a given user with access token attached
     */
    async getAvatarUrlWithAccessToken(userId: string, fileId: string): Promise<?string> {
        const accessToken: TokenLiteral = await TokenService.getReadToken(getTypedFileId(fileId), this.options.token);
        if (typeof accessToken === 'string') {
            return `${this.getAvatarUrl(userId)}?access_token=${accessToken}`;
        }

        return null;
    }
}

export default Users;
