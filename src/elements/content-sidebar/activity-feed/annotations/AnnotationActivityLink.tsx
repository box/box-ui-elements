import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import PlainButton from '../../../../components/plain-button';
import { ButtonType } from '../../../../components/button';

export interface AnnotationActivityLinkProps {
    id: string;
    isDisabled: boolean;
    message: MessageDescriptor;
    onClick: (id: string) => void;
}

const AnnotationActivityLink = ({
    id,
    isDisabled = false,
    message,
    onClick = noop,
}: AnnotationActivityLinkProps): JSX.Element => {
    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        // Prevents document event handlers from executing because box-annotations relies on
        // detecting mouse events on the document outside of annotation targets to determine when to
        // deselect annotations. This link also may represent that annotation target in the sidebar.
        event.nativeEvent.stopImmediatePropagation();

        // Stopping propagation on the mousedown event prevents focus from reaching the button.
        event.currentTarget.focus();

        onClick(id);
    };
    return (
        <PlainButton
            className="bcs-AnnotationActivity-link"
            data-resin-target="annotationLink"
            isDisabled={isDisabled}
            onMouseDown={handleMouseDown}
            type={ButtonType.BUTTON}
        >
            <FormattedMessage {...message} />
        </PlainButton>
    );
};

export default AnnotationActivityLink;
