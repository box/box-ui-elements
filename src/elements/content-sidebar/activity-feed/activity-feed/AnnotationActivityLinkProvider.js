// @flow
import * as React from 'react';
import AnnotationActivityLink from '../annotations/AnnotationActivityLink';

import annotationsMessages from '../annotations/messages';

import type { Annotation } from '../../../../common/types/feed';

type AnnotationActivityLinkProviderProps = {
    item: Annotation,
    onCommentSelectHandler: (itemId: string) => (isSelected: boolean) => void,
};

const AnnotationActivityLinkProvider = ({ item, onCommentSelectHandler }: AnnotationActivityLinkProviderProps) => {
    const isFileVersionUnavailable = item.file_version === null;

    // TODO: probably rethink this
    const isCurrentVersion = true;

    const linkMessage = isCurrentVersion
        ? annotationsMessages.annotationActivityPageItem
        : annotationsMessages.annotationActivityVersionLink;
    const linkValue = isCurrentVersion ? item.target?.location.value : item.file_version?.version_number;

    const activityLinkMessage = isFileVersionUnavailable
        ? annotationsMessages.annotationActivityVersionUnavailable
        : { ...linkMessage, values: { number: linkValue } };

    // $FlowFixMe
    const handleSelect = () => onCommentSelectHandler(item);

    return (
        <AnnotationActivityLink
            className="bcs-AnnotationActivity-link"
            data-resin-target="annotationLink"
            id={item.id}
            isDisabled={isFileVersionUnavailable}
            message={activityLinkMessage}
            onClick={handleSelect}
        />
    );
};

export default AnnotationActivityLinkProvider;
