/**
 * @flow
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
    MetadataTargetLocationEntry,
    MetadataTemplateField,
} from '../common/types/metadata';
import { FIELD_TYPE_TAXONOMY } from '../features/metadata-instance-fields/constants';

/**
 * Formats comment data (including replies) for use in components.
 *
 * @param {Comment} comment - An individual comment entry from the API
 * @return {Comment} Updated comment
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
        return value.map((option: { id: string, displayName: string }) => ({
            value: option.id,
            displayValue: option.displayName,
        }));
    }

    return value;
};

const isDetailedFieldValue = (fieldValue: any): boolean %checks =>
    fieldValue != null && typeof fieldValue === 'object' && !Array.isArray(fieldValue) && 'values' in fieldValue;

const extractDetailedFieldValue = (fieldValue: any): MetadataFieldValue => {
    if (isDetailedFieldValue(fieldValue)) {
        return ((fieldValue: any): MetadataDetailedFieldValue).values;
    }
    return fieldValue;
};

const mapDetailedFieldToConfidenceScore = (fieldValue: any): ?MetadataConfidenceScoreData => {
    if (!isDetailedFieldValue(fieldValue)) {
        return undefined;
    }

    const { details } = ((fieldValue: any): MetadataDetailedFieldValue);
    if (!details || details.confidenceScore == null || !details.confidenceLevel) {
        return undefined;
    }

    return {
        value: details.confidenceScore,
        level: details.confidenceLevel,
        isAccepted: details.process === 'AI_ACCEPTED',
    };
};

const parseTargetLocation = (fieldValue: any): ?Array<MetadataTargetLocationEntry> => {
    if (!isDetailedFieldValue(fieldValue)) {
        return undefined;
    }

    const { details } = ((fieldValue: any): MetadataDetailedFieldValue);
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

const handleOnAbort = (xhr: Xhr) => {
    xhr.abort();

    throw getAbortError();
};

export {
    extractDetailedFieldValue,
    formatComment,
    formatMetadataFieldValue,
    handleOnAbort,
    isDetailedFieldValue,
    mapDetailedFieldToConfidenceScore,
    parseTargetLocation,
};
