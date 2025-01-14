// @flow
import { BrowserInstance } from './BrowserUtils';
import { CONSTANTS } from './constants';

export function createRequestData(extensions: Array<string>): string {
    return JSON.stringify({
        request_type: 'get_default_application',
        extension: extensions,
    });
}

export function createExecuteData(fileId: string, token: string, authCode: string, tokenScope: string): string {
    const execData = JSON.stringify({
        auth_code: authCode,
        auth_token: token,
        browser_type: BrowserInstance.getName(),
        command_type: 'launch_application',
        file_id: fileId.toString(),
        token_scope: tokenScope,
    });
    return execData;
}

export function isBlacklistedExtension(extension: string): boolean {
    const { EXTENSION_BLACKLIST } = CONSTANTS;
    let uppercaseExt = extension.toUpperCase();

    // if ext has a leading ., strip it
    if (uppercaseExt.charAt(0) === '.') {
        uppercaseExt = uppercaseExt.substr(1);
    }

    return uppercaseExt in EXTENSION_BLACKLIST;
}
