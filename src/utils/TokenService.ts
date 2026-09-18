import { TYPED_ID_FOLDER_PREFIX, TYPED_ID_FILE_PREFIX } from '../constants';
import type { Token, TokenLiteral } from '../common/types/core';

const error = new Error(
    'Bad id or auth token. ID should be typed id like file_123 or folder_123! Token should be a string or function.',
);

class TokenService {
    /**
     * Fetches a single token. The supplied value can be a literal token or a function
     * that returns a promise resolving to a string, null, undefined, or a read/write pair.
     */
    static async getToken(id: string, tokenOrTokenFunction?: Token): Promise<string | null | undefined> {
        // Make sure we are getting typed ids
        // Tokens should either be null or undefined or string or functions
        // Anything else is not supported and throw error
        if (
            (tokenOrTokenFunction !== null &&
                tokenOrTokenFunction !== undefined &&
                typeof tokenOrTokenFunction !== 'string' &&
                typeof tokenOrTokenFunction !== 'function') ||
            (!id.startsWith(TYPED_ID_FOLDER_PREFIX) && !id.startsWith(TYPED_ID_FILE_PREFIX))
        ) {
            throw error;
        }

        // Token is a simple string or null or undefined
        if (!tokenOrTokenFunction || typeof tokenOrTokenFunction === 'string') {
            return tokenOrTokenFunction;
        }

        // Token is a function which returns a promise.
        // Promise on resolution returns a string/null/undefined token or token pair.
        const token = await tokenOrTokenFunction(id);
        if (!token || typeof token === 'string' || (typeof token === 'object' && (token.read || token.write))) {
            return token;
        }

        throw error;
    }

    /** Gets a string read token; defaults to a simple token string when given a map. */
    static async getReadToken(id: string, tokenOrTokenFunction?: Token): Promise<string | null | undefined> {
        const token: TokenLiteral = await TokenService.getToken(id, tokenOrTokenFunction);
        if (token && typeof token === 'object') {
            return token.read;
        }

        return token;
    }

    /** Gets read tokens for one or more typed ids, returning an id-to-token map. */
    static async getReadTokens(
        id: string | string[],
        tokenOrTokenFunction: Token,
    ): Promise<Record<string, string | null | undefined>> {
        const ids: string[] = Array.isArray(id) ? id : [id];
        const promises: Array<Promise<string | null | undefined>> = ids.map((typedId: string) =>
            TokenService.getReadToken(typedId, tokenOrTokenFunction),
        );
        const tokens: Array<string | null | undefined> = await Promise.all(promises);
        const tokenMap: Record<string, string | null | undefined> = {};
        tokens.forEach((token, index) => {
            tokenMap[ids[index]] = token;
        });

        return Promise.resolve(tokenMap);
    }

    /** Gets a string write token; falls back to read token or a simple token string. */
    static async getWriteToken(id: string, tokenOrTokenFunction?: Token): Promise<string | null | undefined> {
        const token: TokenLiteral = await TokenService.getToken(id, tokenOrTokenFunction);
        if (token && typeof token === 'object') {
            return token.write || token.read;
        }

        return token;
    }

    /**
     * Invokes the token generator to cache tokens for multiple typed ids.
     * Does not return tokens; intended for generator-side prefetch only.
     */
    static async cacheTokens(ids: Array<string>, tokenOrTokenFunction?: Token): Promise<void> {
        // Make sure we are getting typed ids
        // Tokens should either be null or undefined or string or functions
        // Anything else is not supported and throw error
        if (
            (tokenOrTokenFunction !== null &&
                tokenOrTokenFunction !== undefined &&
                typeof tokenOrTokenFunction !== 'string' &&
                typeof tokenOrTokenFunction !== 'function') ||
            !ids.every(itemId => itemId.startsWith(TYPED_ID_FOLDER_PREFIX) || itemId.startsWith(TYPED_ID_FILE_PREFIX))
        ) {
            throw error;
        }

        // Only need to fetch and cache multiple tokens when the user supplied token was a
        // token function. This function should internally cache the tokens for future use.
        if (typeof tokenOrTokenFunction === 'function') {
            await tokenOrTokenFunction(ids);
        }

        return Promise.resolve();
    }
}

export default TokenService;
