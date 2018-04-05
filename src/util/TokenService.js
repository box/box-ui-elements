/**
 * @flow
 * @file An example of a token managing service
 * @author Box
 */

import { TYPED_ID_FOLDER_PREFIX, TYPED_ID_FILE_PREFIX } from '../constants';
import type { Token } from '../flowTypes';

type TokenMap = { [string]: Token };

const error = new Error(
    'Bad id or auth token. ID should be typed id like file_123 or folder_123! Token should be a string or function.'
);

/**
 * Helper function to create token map used below.
 * Maps one or more tokens to multiple files.
 *
 * @private
 * @param {Array} ids - Box file IDs
 * @param {string} [tokenOrTokens] - Single token or map
 * @return {Object} ID to token map
 */
function createIdTokenMap(ids, tokenOrTokens) {
    const tokenMap = {};
    ids.forEach((id) => {
        if (!tokenOrTokens || typeof tokenOrTokens === 'string') {
            // All files use the same string or null or undefined token
            tokenMap[id] = tokenOrTokens;
        } else if (typeof tokenOrTokens === 'object') {
            // Map ids and tokens to ids and tokens
            tokenMap[id] = tokenOrTokens[id];
        }
    });
    return tokenMap;
}
class TokenService {
    /**
     * Gets one token.
     * The token can either be a simple string or a function that returns
     * a promise which resolves to a key value map where key is the file
     * id and value is the token. The function accepts either a simple id
     * or an array of file ids. The token can also be null or undefined.
     *
     * @private
     * @param {string} id - box item typed id
     * @param {string} tokenOrTokenFunction - Optional token or token function
     * @return {Promise} that resolves to a token
     */
    static getToken(id: string, tokenOrTokenFunction: Token): Promise<?string> {
        // Make sure we are getting typed ids
        // Tokens should either be null or undefuned or string or functions
        // Anything else is not supported and throw error
        if (
            (tokenOrTokenFunction !== null &&
                tokenOrTokenFunction !== undefined &&
                typeof tokenOrTokenFunction !== 'string' &&
                typeof tokenOrTokenFunction !== 'function') ||
            (!id.startsWith(TYPED_ID_FOLDER_PREFIX) && !id.startsWith(TYPED_ID_FILE_PREFIX))
        ) {
            return Promise.reject(error);
        }

        // Token is a simple string or null or undefined
        if (!tokenOrTokenFunction || typeof tokenOrTokenFunction === 'string') {
            return Promise.resolve(tokenOrTokenFunction);
        }

        // Token is a function which returns a promise
        // that on resolution returns an id to token map.
        return new Promise(async (resolve: Function, reject: Function) => {
            // $FlowFixMe Already checked null above
            const token = await tokenOrTokenFunction(id);
            if (!token || typeof token === 'string') {
                resolve(token);
            } else if (typeof token === 'object') {
                resolve(token[id]);
            } else {
                reject(error);
            }
        });
    }

    /**
     * Gets multiple tokens.
     * The token can either be a simple string or a function that returns
     * a promise which resolves to a key value map where key is the file
     * id and value is the token. The function accepts either a simple id
     * or an array of file ids. The token can also be null or undefined.
     *
     * @private
     * @param {Array<string>} idd - box item typed ids
     * @param {string} tokenOrTokenFunction - Optional token or token function
     * @return {Promise<TokenMap>} that resolves to a token map
     */
    static getTokens(ids: Array<string>, tokenOrTokenFunction: Token): Promise<TokenMap> {
        // Make sure we are getting typed ids
        // Tokens should either be null or undefuned or string or functions
        // Anything else is not supported and throw error
        if (
            (tokenOrTokenFunction !== null &&
                tokenOrTokenFunction !== undefined &&
                typeof tokenOrTokenFunction !== 'string' &&
                typeof tokenOrTokenFunction !== 'function') ||
            !ids.every((itemId) => itemId.startsWith(TYPED_ID_FOLDER_PREFIX) || itemId.startsWith(TYPED_ID_FILE_PREFIX))
        ) {
            return Promise.reject(error);
        }

        // Token is a simple string or null or undefined
        if (!tokenOrTokenFunction || typeof tokenOrTokenFunction === 'string') {
            return Promise.resolve(createIdTokenMap(ids, tokenOrTokenFunction));
        }

        // Token is a function which returns a promise
        // that on resolution returns an id to token map.
        return new Promise(async (resolve: Function, reject: Function) => {
            // $FlowFixMe Already checked null above
            const token = await tokenOrTokenFunction(ids);
            if (!token || typeof token === 'object' || typeof token === 'string') {
                resolve(createIdTokenMap(ids, token));
            } else {
                reject(error);
            }
        });
    }
}

export default TokenService;
