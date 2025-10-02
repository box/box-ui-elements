/**
 * @flow
 * @file Utils for the box APIs
 * @author Box
 */

import type Xhr from '../utils/Xhr';
import type { Comment } from '../common/types/feed';
import { getAbortError } from '../utils/error';
import type { MetadataTemplateField, MetadataFieldValue } from '../common/types/metadata';
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

const handleOnAbort = (xhr: Xhr) => {
    xhr.abort();

    throw getAbortError();
};

export { formatComment, formatMetadataFieldValue, handleOnAbort };
