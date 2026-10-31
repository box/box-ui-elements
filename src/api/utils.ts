/**
 * @file Utils for the box APIs
 * @author Box
 */

import type Xhr from '../utils/Xhr';
import type { Comment } from '../common/types/feed';
import { getAbortError } from '../utils/error';
import type {
    MetadataConfidenceScoreData,
    MetadataDetailedFieldValue,
    MetadataFieldValue,
    MetadataInstanceV2,
    MetadataTargetLocationEntry,
    MetadataTemplateField,
} from '../common/types/metadata';
import { FIELD_TYPE_TAXONOMY } from '../features/metadata-instance-fields/constants';

import { AI_EXTRACTED_PROCESS, AI_ACCEPTED_PROCESS } from '../constants';

/**
 * Formats comment data (including replies) for use in components.
 *
 * @param comment - An individual comment entry from the API
 * @return Updated comment
 */
const formatComment = (comment: Comment): Comment => {
    const formattedComment = {
        ...comment,
        tagged_message: comment.message,
    };

    if (comment.replies && comment.replies.length) {
        formattedComment.replies = comment.replies.map(formatComment);
    }

    return formattedComment;
};

const formatMetadataFieldValue = (field: MetadataTemplateField, value: MetadataFieldValue): MetadataFieldValue => {
    if (field.type === FIELD_TYPE_TAXONOMY && Array.isArray(value)) {
        return value.map((option: { id: string; displayName: string }) => ({
            value: option.id,
            displayValue: option.displayName,
        }));
    }

    return value;
};

const isDetailedFieldValue = (fieldValue: unknown): fieldValue is MetadataDetailedFieldValue =>
    fieldValue != null && typeof fieldValue === 'object' && !Array.isArray(fieldValue) && 'values' in fieldValue;

const extractDetailedFieldValue = (fieldValue: unknown): MetadataFieldValue => {
    if (isDetailedFieldValue(fieldValue)) {
        return fieldValue.values;
    }
    return fieldValue as MetadataFieldValue;
};

const mapDetailedFieldToConfidenceScore = (fieldValue: unknown): MetadataConfidenceScoreData | undefined => {
    if (!isDetailedFieldValue(fieldValue)) {
        return undefined;
    }

    const { details } = fieldValue;
    if (!details || details.confidenceScore == null || !details.confidenceLevel) {
        return undefined;
    }

    return {
        value: details.confidenceScore,
        level: details.confidenceLevel,
        isAccepted: details.process === AI_ACCEPTED_PROCESS,
    };
};

const parseTargetLocation = (fieldValue: unknown): Array<MetadataTargetLocationEntry> | undefined => {
    if (!isDetailedFieldValue(fieldValue)) {
        return undefined;
    }

    const { details } = fieldValue;
    if (!details || !details.targetLocation) {
        return undefined;
    }

    try {
        const parsed = JSON.parse(details.targetLocation);
        if (!Array.isArray(parsed)) {
            return undefined;
        }
        return parsed;
    } catch {
        return undefined;
    }
};

const checkIsExtractedProcessFieldValue = (fieldValue: unknown): boolean => {
    if (!isDetailedFieldValue(fieldValue)) {
        return false;
    }

    const { details } = fieldValue;

    return details != null && typeof details.process === 'string' && details.process === AI_EXTRACTED_PROCESS;
};

const mergeDetailedAndHydratedInstances = (
    detailedEntries: Array<MetadataInstanceV2>,
    hydratedEntries: Array<MetadataInstanceV2>,
): Array<MetadataInstanceV2> => {
    const hydratedById: { [key: string]: MetadataInstanceV2 } = {};
    hydratedEntries.forEach(entry => {
        hydratedById[entry.$id] = entry;
    });

    return detailedEntries.map(detailedEntry => {
        const hydratedEntry = hydratedById[detailedEntry.$id];
        if (!hydratedEntry) {
            return detailedEntry;
        }

        const merged: MetadataInstanceV2 & { [key: string]: unknown } = { ...detailedEntry };
        Object.keys(hydratedEntry).forEach(key => {
            if (key.startsWith('$')) {
                return;
            }

            const mergedField = merged[key];
            if (isDetailedFieldValue(mergedField)) {
                merged[key] = {
                    ...mergedField,
                    values: hydratedEntry[key],
                };
                return;
            }

            if (!Object.prototype.hasOwnProperty.call(merged, key)) {
                Object.defineProperty(merged, key, {
                    configurable: true,
                    enumerable: true,
                    value: { values: hydratedEntry[key] },
                    writable: true,
                });
            }
        });

        return merged;
    });
};

const handleOnAbort = (xhr: Xhr): never => {
    xhr.abort();

    throw getAbortError();
};

export {
    checkIsExtractedProcessFieldValue,
    extractDetailedFieldValue,
    formatComment,
    formatMetadataFieldValue,
    handleOnAbort,
    isDetailedFieldValue,
    mapDetailedFieldToConfidenceScore,
    mergeDetailedAndHydratedInstances,
    parseTargetLocation,
};
