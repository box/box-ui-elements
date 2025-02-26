import * as React from 'react';
import AnnotationActivityLink from '../annotations/AnnotationActivityLink';
import annotationsMessages from '../annotations/messages';
import { Annotation } from '../../../../common/types/feed';

interface AnnotationActivityLinkProviderProps {
    isCurrentVersion: boolean;
    item: Annotation;
    onSelect: (annotation: Annotation) => void;
}

const AnnotationActivityLinkProvider = ({ isCurrentVersion, item, onSelect }: AnnotationActivityLinkProviderProps) => {
    const { file_version, id, target } = item;

    const isFileVersionUnavailable = file_version === null;

    const linkMessage = isCurrentVersion
        ? annotationsMessages.annotationActivityPageItem
        : annotationsMessages.annotationActivityVersionLink;
    const linkValue = isCurrentVersion ? target?.location.value : file_version?.version_number;

    const activityLinkMessage = isFileVersionUnavailable
        ? annotationsMessages.annotationActivityVersionUnavailable
        : { ...linkMessage, values: { number: linkValue } };

    const handleSelect = () => onSelect(item);

    return (
        <AnnotationActivityLink
            className="bcs-AnnotationActivity-link"
            data-resin-target="annotationLink"
            id={id}
            isDisabled={isFileVersionUnavailable}
            message={activityLinkMessage}
            onClick={handleSelect}
        />
    );
};

export default AnnotationActivityLinkProvider;
