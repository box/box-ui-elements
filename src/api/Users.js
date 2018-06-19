/**
 * @flow
 * @file Helper for the box Users API
 * @author Box
 */

import Base from './Base';
import TokenService from '../util/TokenService';
import { getTypedFileId } from '../util/file';

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
     * Gets the user avatar URL
     *
     * @param {string} userId the user id
     * @param {string} fileId the file id
     * @return {string} the user avatar URL string for a given user with access token attached
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
