import queryString from 'query-string';
import TokenService from '../utils/TokenService';
import { getTypedFileId } from '../utils/file';
import Base from './Base';
import { ERROR_CODE_FETCH_CURRENT_USER } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { TokenLiteral } from '../common/types/core';

class Users extends Base {
    /** API URL for the current user. */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/users/me`;
    }

    /** API URL for the avatar of the Box user `id`. Throws when `id` is missing. */
    getAvatarUrl(id: string): string {
        if (!id) {
            throw new Error('Missing user id');
        }

        return `${this.getBaseApiUrl()}/users/${id}/avatar`;
    }

    /**
     * Gets the avatar URL for `userId`, with a read token for `fileId` attached, from cache or by getting a new token.
     * Resolves with `null` when `userId` is missing or no string token is available.
     */
    async getAvatarUrlWithAccessToken(userId: string | null | undefined, fileId: string): Promise<string | null> {
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

    /** Fetches the user, using the Box item `id` for request authorization. */
    getUser(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: object = {},
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
