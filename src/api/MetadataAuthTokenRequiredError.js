/**
 * @flow
 * @file Error thrown when namespaced template requests have no usable user token.
 */

export default class MetadataAuthTokenRequiredError extends Error {
    name: string;

    constructor() {
        super(
            'Namespaced template requests need a user access token. Pass token as a string, or getMetadataAuthToken when token is generated per file.',
        );
        this.name = 'MetadataAuthTokenRequiredError';
    }
}
