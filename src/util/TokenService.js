/**
 * @flow
 * @file An example of a token managing service
 * @author Box
 */
import type { Token } from '../flowTypes';

const TOO_MANY_REQUESTS = 'Too many tokens requested at a single time!';
const REQUEST_LIMIT_HARD = 200;
const REQUEST_LIMIT = 100;

type TokenWrapper = {
    token: Token,
    promise: Promise<any>,
    expiration: number
};

type Tokens = {
    [id: string]: TokenWrapper
};

type TokenMap = {
    [id: string]: Token
};

class TokenService {
    /**
     * @property {Object}
     */
    tokens: Tokens;

    /**
     * @property {string}
     */
    url: string;

    /**
     * @property {number}
     */
    timeout: number;

    /**
     * @property {number}
     */
    requestLimit: number;

    /**
     * @property {number}
     */
    hardLimit: number;

    /**
     * @property {Object}
     */
    data: { [id: string]: any };

    /**
     * @property {Object}
     */
    headers: { [id: string]: string };

    /**
     * [constructor]
     *
     * @public
     * @param {string} url - token fetch url
     * @param {number} timeout - token timeout
     * @param {number|void} [requestLimit] - optional limits number of tokens fetched per request
     * @param {number|void} [hardLimit] - optional hard overall limit for number of tokens to fetch
     * @param {Object|void} [data] - optional data to send to auth end point
     * @param {Object|void} [headers] - optional headers to send to auth end point
     * @return {TokenService}
     */
    constructor({
        url,
        timeout,
        requestLimit = REQUEST_LIMIT,
        hardLimit = REQUEST_LIMIT_HARD,
        data = {},
        headers = {}
    }: {
        url: string,
        timeout: number,
        requestLimit: number,
        hardLimit: number,
        data: { [id: string]: any },
        headers: { [id: string]: any }
    }) {
        this.url = url;
        this.timeout = timeout;
        this.requestLimit = requestLimit;
        this.hardLimit = hardLimit;
        this.data = data;
        this.headers = Object.assign(
            {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            headers
        );
        this.tokens = {};
    }

    /**
     * Returns the expiration date for tokens
     * Threshold is set to 90% of actual token timeout
     *
     * @private
     * @return {number}
     */
    getExpiration(): number {
        return Date.now() + 0.9 * this.timeout;
    }

    /**
     * Cleans up any file tokens that have passed their expiration times
     *
     * @private
     * @param {string[]} ids - List of IDs to check
     * @return {void}
     */
    cleanUpExpiredTokens(ids: string[]) {
        const now = Date.now();
        ids.forEach((id: string) => {
            const token = this.tokens[id];
            if (token && token.expiration < now) {
                delete this.tokens[id];
            }
        });
    }

    /**
     * Returns a list of existing promises for ids
     *
     * @private
     * @param {string[]} ids - List of IDs to check
     * @return {Promise[]}
     */
    getExistingTokenRequestPromises(ids: string[]): Promise<any>[] {
        return ids.map((id: string) => this.tokens[id].promise);
    }

    /**
     * Returns a list of new, unrequested ids
     *
     * @private
     * @param {string[]} ids - List of IDs to check
     * @return {string[]}
     */
    getNewlyRequestedIds(ids: string[]): string[] {
        return ids.filter((id: string) => !this.tokens[id]);
    }

    /**
     * Returns a list of already requested ids
     *
     * @private
     * @param {string[]} ids - List of IDs to check
     * @return {string[]}
     */
    getPreviouslyRequestedIds(ids: string[]): string[] {
        return ids.filter((id: string) => !!this.tokens[id]);
    }

    /**
     * Returns a list of already requested ids
     *
     * @private
     * @param {string[]} ids - List of IDs to check
     * @return {string[]}
     */
    getIdTokenMap(ids: string[]): TokenMap {
        const map: TokenMap = {};
        ids.forEach((id: string) => {
            map[id] = this.tokens[id].token;
        });
        return map;
    }

    /**
     * Chunks ids into arrays of size requestLimit
     *
     * @private
     * @param {string[]} ids - List of file IDs to check
     * @return {string[][]} An array of string[]
     */
    getChunksOfIds(ids: string[]): string[][] {
        const chunks: string[][] = [];
        const requestLimit: number = this.requestLimit;
        const len: number = ids.length;
        for (let i: number = 0; i < len; i += requestLimit) {
            chunks.push(ids.slice(i, i + requestLimit));
        }
        return chunks;
    }

    /**
     * Creates auth tokens for a list of file ids
     *
     * @private
     * @param {string[]} ids File IDs to create tokens for
     * @return {Promise} Returns a promise that will resolve when tokens are done fetching
     */
    createTokens(ids: string[]): Promise<any> {
        if (ids.length > this.requestLimit) {
            return Promise.reject(new Error(TOO_MANY_REQUESTS));
        }

        const expiration: number = this.getExpiration();
        const promise: Promise<any> = fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(Object.assign({ ids }, this.data)).replace(/"\s+|\s+"/g, '"'),
            credentials: 'same-origin'
        });

        return promise
            .then((response) => response.json())
            .then((data) => {
                ids.forEach((id) => {
                    this.tokens[id] = { promise, expiration, token: data[id] };
                });
            })
            .catch(() => {
                ids.forEach((id: string) => delete this.tokens[id]);
                throw new Error('Auth tokens could not be fetched!');
            });
    }

    /**
     * Returns an id to token map
     *
     * @private
     * @param {string[]} ids List of IDs to check
     * @return {string[]}
     */
    getTokens(ids: string[]): Promise<TokenMap> {
        this.cleanUpExpiredTokens(ids);

        const previouslyRequestedids = this.getPreviouslyRequestedIds(ids);
        const newlyRequestedIds = this.getNewlyRequestedIds(ids);
        const promises = previouslyRequestedids.length
            ? this.getExistingTokenRequestPromises(previouslyRequestedids)
            : [];
        const numberOfNewRequests = newlyRequestedIds.length;

        if (numberOfNewRequests) {
            if (numberOfNewRequests > this.hardLimit) {
                return Promise.reject(new Error(TOO_MANY_REQUESTS));
            }
            this.getChunksOfIds(newlyRequestedIds).forEach((chunk: string[]) => {
                promises.push(this.createTokens(chunk));
            }, this);
        }

        return Promise.all(promises).then(() => this.getIdTokenMap(ids));
    }

    /**
     * Returns a token for the given item id
     * or a map of ids to tokens
     *
     * @public
     * @param {string|string[]} id id to check
     * @return {string|Object}
     */
    getToken(id: string | string[]): Promise<Token | TokenMap> {
        const ids: string[] = Array.isArray(id) ? id : [id];
        return this.getTokens(ids).then((tokens: TokenMap) => (Array.isArray(id) ? tokens : tokens[id]));
    }
}

global.Box.TokenService = TokenService;
export default TokenService;
