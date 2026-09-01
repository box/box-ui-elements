/**
 * @file Strips wrapping rich-text markdown delimiters for flag-off read paths.
 * Handles **bold**, __bold__, _italic_, *italic*, and ++underline++ only.
 * List markers (- , 1.) are intentionally left unchanged.
 */

const MENTION_PATTERN = /@\[([^:\]]+):([^\]]+)\]/g;

const MENTION_PLACEHOLDER_PREFIX = '\u0000mention:';
const MENTION_PLACEHOLDER_SUFFIX = '\u0000';

const WRAP_DELIMITERS = ['++', '**', '__', '_', '*'] as const;

const protectMentions = (text: string): { protectedText: string; mentions: string[] } => {
    const mentions: string[] = [];
    const protectedText = text.replace(MENTION_PATTERN, mention => {
        mentions.push(mention);
        return `${MENTION_PLACEHOLDER_PREFIX}${mentions.length - 1}${MENTION_PLACEHOLDER_SUFFIX}`;
    });

    return { protectedText, mentions };
};

const restoreMentions = (text: string, mentions: string[]): string =>
    text.replace(
        new RegExp(`${MENTION_PLACEHOLDER_PREFIX}(\\d+)${MENTION_PLACEHOLDER_SUFFIX}`, 'g'),
        (_, index) => mentions[Number(index)] ?? '',
    );

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const unwrapDelimiter = (text: string, delimiter: string): string => {
    const escaped = escapeRegExp(delimiter);
    return text.replace(new RegExp(`${escaped}([\\s\\S]*?)${escaped}`, 'g'), '$1');
};

const stripProtectedText = (text: string): string => {
    let result = text;
    let previous: string;

    do {
        previous = result;
        for (const delimiter of WRAP_DELIMITERS) {
            result = unwrapDelimiter(result, delimiter);
        }
    } while (result !== previous);

    return result;
};

/**
 * Removes wrapping markdown syntax from a wire-format message string.
 * Mention tokens `@[id:name]` are preserved. List syntax is not interpreted.
 */
export const stripWrappingMarkdown = (text: string): string => {
    if (!text) {
        return text;
    }

    const { protectedText, mentions } = protectMentions(text);
    const stripped = stripProtectedText(protectedText);

    return restoreMentions(stripped, mentions);
};
