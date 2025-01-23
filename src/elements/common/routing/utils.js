/**
 * @file Utility functions for routing
 */

/**
 * @typedef {Object} MatchOptions
 * @property {string} path
 * @property {boolean} [exact]
 * @property {boolean} [strict]
 */

/**
 * @typedef {Object} Match
 * @property {string} path
 * @property {string} url
 * @property {boolean} isExact
 * @property {Object.<string, string>} params
 */

/**
 * Matches a pathname against a path pattern
 * @param {string} pathname
 * @param {MatchOptions} options
 * @returns {Match|null}
 */
export const matchPath = (pathname, { path, exact = false, strict = false }) => {
    // Handle array of paths
    if (Array.isArray(path)) {
        for (const p of path) {
            const match = matchPath(pathname, { path: p, exact, strict });
            if (match) return match;
        }
        return null;
    }

    const trimmedPath = String(path || '').replace(/\/$/, '');
    const trimmedPathname = String(pathname || '').replace(/\/$/, '');

    // Extract params from path pattern
    const paramNames = [];
    const regexPath = trimmedPath.replace(/:([^/]+)/g, (match, paramName) => {
        paramNames.push(paramName);
        // Allow commas in parameter values for metadata template IDs
        return paramName === 'filteredTemplateIds' ? '([^/]+)' : '([^/,]+)';
    });

    const regex = new RegExp(`^${regexPath}${strict ? '' : '/?'}${exact ? '$' : ''}`);
    const match = trimmedPathname.match(regex);

    if (!match) {
        return null;
    }

    const params = {};
    paramNames.forEach((name, index) => {
        const value = match[index + 1];
        // Handle special case for filteredTemplateIds which can be comma-separated
        params[name] = value;
    });

    return {
        path,
        url: match[0],
        isExact: match[0] === trimmedPathname,
        params,
    };
};

/**
 * Generates a path with parameters replaced by their values
 * @param {string} path - The path pattern with parameter placeholders
 * @param {Object} [params] - The parameter values to substitute
 * @returns {string} The generated path
 */
export const generatePath = (path, params) => {
    if (!params) {
        return path;
    }

    return Object.keys(params).reduce((acc, key) => {
        const value = params[key];
        const pattern = `:${key}`;
        return acc.replace(pattern, value);
    }, path);
};
