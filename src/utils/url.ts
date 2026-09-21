import Uri from 'jsuri';

/** Update URL query parameters */
const updateQueryParameters = (url: string, queryParams: Record<string, unknown>): string => {
    if (!queryParams) {
        return url;
    }

    const uri = new Uri(url);

    Object.keys(queryParams).forEach(key => {
        const value = queryParams[key];

        if (!value) {
            return;
        }

        if (uri.hasQueryParam(key)) {
            uri.replaceQueryParam(key, value);
            return;
        }

        uri.addQueryParam(key, value);
    });

    return uri.toString();
};

export { updateQueryParameters };
