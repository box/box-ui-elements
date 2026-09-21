/**
 * @file Serialization for the leading timestamp markup carried inside a comment message.
 *
 * There is no API field for a comment timestamp: the value is written into the message string
 * and parsed back out on render. The format is `#[key:value,...]` with numeric values, and is
 * shared with other clients, so the parser tolerates arbitrary key order and unknown keys.
 * @author Box
 */

import { AnnotationBadgeType } from '@box/threaded-annotations';
import { convertMillisecondsToTimestamp } from '../../../utils/timestamp';

import type { AnnotationBadgeTargetType } from './types';

const TIMESTAMP_MARKUP_REGEX = /^#\[([a-zA-Z][a-zA-Z0-9]*:\d+(?:,[a-zA-Z][a-zA-Z0-9]*:\d+)*)\]\s*/;

const KEY_START = 'timestamp';
const KEY_END = 'endTimestamp';
const KEY_VERSION_ID = 'versionId';

const toMs = (raw: string | undefined): number | undefined => {
    if (raw === undefined) return undefined;
    const ms = Number(raw);
    return Number.isSafeInteger(ms) && ms >= 0 ? ms : undefined;
};

export const extractTimestampMarkup = (
    text: string,
): {
    cleanText: string;
    target?: AnnotationBadgeTargetType;
    timestampEndMs?: number;
    timestampMarkup?: string;
    timestampMs?: number;
} => {
    if (!text) return { cleanText: '' };
    const match = text.match(TIMESTAMP_MARKUP_REGEX);
    if (!match) return { cleanText: text };

    const [fullMatch, keyValues] = match;
    const values = new Map(keyValues.split(',').map(pair => pair.split(':') as [string, string]));
    // Markup that carries no start timestamp is not ours; leave the message untouched.
    if (!values.has(KEY_START)) return { cleanText: text };

    const cleanText = text.slice(fullMatch.length);
    const ms = toMs(values.get(KEY_START));
    if (ms === undefined) return { cleanText };

    const endMs = toMs(values.get(KEY_END));
    const target: AnnotationBadgeTargetType = {
        timestamp: convertMillisecondsToTimestamp(ms),
        type: AnnotationBadgeType.Frame,
    };
    return {
        cleanText,
        target,
        // A range that does not move forward is not a range.
        timestampEndMs: endMs !== undefined && endMs > ms ? endMs : undefined,
        timestampMarkup: fullMatch.trimEnd(),
        timestampMs: ms,
    };
};

export const buildTimestampMarkup = ({
    endMs,
    startMs,
    versionId,
}: {
    endMs?: number;
    startMs: number;
    versionId: string;
}): string => {
    const hasRange = endMs !== undefined && Number.isSafeInteger(endMs) && endMs > startMs;
    const end = hasRange ? `,${KEY_END}:${endMs}` : '';
    return `#[${KEY_START}:${startMs}${end},${KEY_VERSION_ID}:${versionId}]`;
};
