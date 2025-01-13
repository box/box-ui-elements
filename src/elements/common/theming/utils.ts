import isObject from 'lodash/isObject';
import kebabCase from 'lodash/kebabCase';

const convertTokensToCustomProperties = (tokens = {}, prefix = '') => {
    const customProperties = {};

    Object.entries(tokens).forEach(([level, value]) => {
        const levelName = `${prefix}${kebabCase(level)}`;

        if (isObject(value)) {
            const properties = convertTokensToCustomProperties(value, `${levelName}-`);
            Object.entries(properties).forEach(([tokenName, tokenValue]) => {
                customProperties[tokenName] = tokenValue;
            });
        } else {
            customProperties[`--${levelName}`] = value;
        }
    });

    return customProperties;
};

export { convertTokensToCustomProperties };
