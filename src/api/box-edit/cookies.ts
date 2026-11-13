/**
 * Gets a cookie by name
 */
const get = (name: string): string => {
    const { document } = window;
    const cookies = document.cookie.split('; ');
    const len = cookies.length;

    let pair;
    let i;

    for (i = 0; i < len; i += 1) {
        pair = cookies[i].split('=');

        if (pair[0] === name) {
            if (pair[1]) {
                // Internet Explorer doesn't set a = on empty cookie values, therefore pair[1] is undefined
                return decodeURIComponent(pair[1]);
            }
            return '';
        }
    }

    return '';
};

/**
 * Sets a cookie. The name and value are required, and all other params have default values.
 * It is recommended to use the default values unless you have a specific reason to override them.
 *
 * @param expires - Expiration date in UNIX time. Defaults to 2 months in the future when undefined. 0 for session cookies.
 * @param path - (Optional) Cookie path. Defaults to the root path '/'.
 * @param domain - (Optional) Cookie domain. Defaults to the cookie_domain used server-side.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Any value is accepted and coerced by encodeURIComponent.
const set = (name: string, value: any, expires: number, path: string = '/', domain: string = ''): void => {
    const { document } = window;
    const expiresDate = new Date();
    const cookie: string[] = [];

    if (typeof expires === 'undefined') {
        expires = expiresDate.getTime() + 1000 * 3600 * 24 * 60; // two months;
    }
    expiresDate.setTime(expires);

    cookie.push(`${name}=${encodeURIComponent(value)}`);
    if (expires !== 0) {
        // do not add "expires" when creating a session cookie
        cookie.push(`; expires=${expiresDate.toUTCString()}`);
    }
    cookie.push(`; path=${path}`);

    if (domain) {
        cookie.push(`; domain=${domain}`);
    }

    cookie.push('; secure');

    document.cookie = cookie.join('');
};

/**
 * Deletes a cookie by name.
 */
const remove = (name: string): void => {
    set(name, '', new Date(0).getTime());
};

/**
 * Checks if cookies are enabled for this browser
 * This is useful when treating Box as a 3rd party (iframed)
 */
const isEnabled = (): boolean => {
    const { document } = window;
    const theCookie = document.cookie;
    return !!(theCookie && theCookie.length > 0);
};

export { get, isEnabled, remove, set };
