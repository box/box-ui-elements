/**
 * 
 * @file An example of a token managing service
 * @author Box
 */

import { TYPED_ID_FOLDER_PREFIX, TYPED_ID_FILE_PREFIX } from '../constants';
const error = new Error('Bad id or auth token. ID should be typed id like file_123 or folder_123! Token should be a string or function.');
class TokenService {
  /**
   * Function to fetch a single token. The user supplied token can either
   * itself be a simple token or instead be a function that returns a promise.
   * This promise then resolves to either a string/null/undefined token or
   * a read/write token pair.
   *
   * @private
   * @param {string} id - box item typed id
   * @param {string} tokenOrTokenFunction - Optional token or token function
   * @return {Promise} that resolves to a token
   */
  static async getToken(id, tokenOrTokenFunction) {
    // Make sure we are getting typed ids
    // Tokens should either be null or undefined or string or functions
    // Anything else is not supported and throw error
    if (tokenOrTokenFunction !== null && tokenOrTokenFunction !== undefined && typeof tokenOrTokenFunction !== 'string' && typeof tokenOrTokenFunction !== 'function' || !id.startsWith(TYPED_ID_FOLDER_PREFIX) && !id.startsWith(TYPED_ID_FILE_PREFIX)) {
      throw error;
    }

    // Token is a simple string or null or undefined
    if (!tokenOrTokenFunction || typeof tokenOrTokenFunction === 'string') {
      return tokenOrTokenFunction;
    }

    // Token is a function which returns a promise.
    // Promise on resolution returns a string/null/undefined token or token pair.
    const token = await tokenOrTokenFunction(id);
    if (!token || typeof token === 'string' || typeof token === 'object' && (token.read || token.write)) {
      return token;
    }
    throw error;
  }

  /**
   * Gets a string read token.
   * Defaults to a simple token string.
   *
   * @public
   * @param {string} id - box item typed id
   * @param {Token} tokenOrTokenFunction - Optional token or token function
   * @return {Promise} that resolves to a token
   */
  static async getReadToken(id, tokenOrTokenFunction) {
    const token = await TokenService.getToken(id, tokenOrTokenFunction);
    if (token && typeof token === 'object') {
      return token.read;
    }
    return token;
  }

  /**
   * Gets read tokens.
   *
   * @public
   * @param {string|string[]} id - box item typed id(s)
   * @param {Token} tokenOrTokenFunction - Token to use or token generation function
   * @return {Promise} Promise that resolves with id to token map
   */
  static async getReadTokens(id, tokenOrTokenFunction) {
    const ids = Array.isArray(id) ? id : [id];
    const promises = ids.map(typedId => TokenService.getReadToken(typedId, tokenOrTokenFunction));
    const tokens = await Promise.all(promises);
    const tokenMap = {};
    tokens.forEach((token, index) => {
      tokenMap[ids[index]] = token;
    });
    return Promise.resolve(tokenMap);
  }

  /**
   * Gets a string write token.
   * Defaults to either the read token or a simple token string.
   *
   * @public
   * @param {string} id - box item typed id
   * @param {string} tokenOrTokenFunction - Optional token or token function
   * @return {Promise} that resolves to a token
   */
  static async getWriteToken(id, tokenOrTokenFunction) {
    const token = await TokenService.getToken(id, tokenOrTokenFunction);
    if (token && typeof token === 'object') {
      return token.write || token.read;
    }
    return token;
  }

  /**
   * Function to fetch and cache multiple tokens. The user supplied token can either
   * itself be a simple token or instead be a function that returns a promise.
   * This promise then resolves signifying requested tokens were cached.
   *
   * This function however does not return tokens as it is expected to only be used
   * by the token generator to cache all tokens that may be needed in the future.
   *
   * @public
   * @param {Array<string>} idd - box item typed ids
   * @param {string} tokenOrTokenFunction - Optional token or token function
   * @return {Promise<TokenMap>} that resolves to a token map
   */
  static async cacheTokens(ids, tokenOrTokenFunction) {
    // Make sure we are getting typed ids
    // Tokens should either be null or undefined or string or functions
    // Anything else is not supported and throw error
    if (tokenOrTokenFunction !== null && tokenOrTokenFunction !== undefined && typeof tokenOrTokenFunction !== 'string' && typeof tokenOrTokenFunction !== 'function' || !ids.every(itemId => itemId.startsWith(TYPED_ID_FOLDER_PREFIX) || itemId.startsWith(TYPED_ID_FILE_PREFIX))) {
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
//# sourceMappingURL=TokenService.js.map