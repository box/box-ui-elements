import camelCase from 'lodash/camelCase';

const KEY_PATTERN_TEMPLATE = (prefix: string) => new RegExp(`^${prefix}(\\d+)$`);
const ASCII_MAX_CODE_POINT = 0x7f;
const MULTIPLE_WHITESPACE_PATTERN = /\s+/g;
const STARTS_WITH_DIGIT_PATTERN = /^\d/;
const REGEX_SPECIAL_CHARS_PATTERN = /[.*+?^${}()|[\]\\]/g;

const escapeRegExp = (value: string): string => value.replace(REGEX_SPECIAL_CHARS_PATTERN, '\\$&');

const stripNonASCII = (value: string): string =>
    Array.from(value)
        .filter(char => char.charCodeAt(0) <= ASCII_MAX_CODE_POINT)
        .join('');

const collapseWhitespace = (value: string): string => value.replace(MULTIPLE_WHITESPACE_PATTERN, ' ').trim();

const normalizeInput = (raw: string): string => collapseWhitespace(stripNonASCII(raw));

const getNextKey = (existingKeys: string[], defaultPrefix: string): string => {
    let maxNumber = 0;
    const pattern = KEY_PATTERN_TEMPLATE(defaultPrefix);

    existingKeys.forEach(key => {
        const match = key.match(pattern);

        if (match) {
            const currentNumber = parseInt(match[1], 10);
            if (currentNumber > maxNumber) {
                maxNumber = currentNumber;
            }
        }
    });

    return `${defaultPrefix}${maxNumber + 1}`;
};

const ensureUniqueKey = (baseKey: string, existingKeys: string[]): string => {
    if (baseKey.length === 0) {
        return baseKey;
    }

    let hasBaseKey = false;
    let maxNumber = 0;
    const pattern = new RegExp(`^${escapeRegExp(baseKey)}(\\d+)$`);

    existingKeys.forEach(key => {
        if (key === baseKey) {
            hasBaseKey = true;
            return;
        }

        const match = key.match(pattern);
        if (!match) {
            return;
        }

        const currentNumber = parseInt(match[1], 10);
        if (!Number.isNaN(currentNumber)) {
            maxNumber = Math.max(maxNumber, currentNumber);
        }
    });

    if (!hasBaseKey) {
        return baseKey;
    }

    return `${baseKey}${maxNumber + 1}`;
};

/**
 * Matches Admin console `generateUniqueKey` for metadata template keys on create.
 */
export function generateMetadataTemplateKey(str: string, existingKeys: string[], defaultPrefix = 'template'): string {
    const safeKeys = existingKeys ?? [];
    if (str.length === 0) {
        return getNextKey(safeKeys, defaultPrefix);
    }

    const normalized = normalizeInput(str);

    if (normalized.length === 0) {
        return getNextKey(safeKeys, defaultPrefix);
    }

    let baseKey = camelCase(normalized);

    if (baseKey.length === 0) {
        return getNextKey(safeKeys, defaultPrefix);
    }

    if (STARTS_WITH_DIGIT_PATTERN.test(baseKey)) {
        baseKey = `${defaultPrefix}${baseKey}`;
    }

    return ensureUniqueKey(baseKey, safeKeys);
}
