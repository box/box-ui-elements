import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import PlainButton from '../../../../components/plain-button';
import { ButtonType } from '../../../../components/button';

export interface AnnotationActivityLinkProps {
    id: string;
    message: MessageDescriptor;
    onClick: (id: string) => void;
}

const AnnotationActivityLink = ({ id, message, onClick = noop }: AnnotationActivityLinkProps): JSX.Element => {
    const handleClick = (event: React.SyntheticEvent) => {
        event.preventDefault();
        event.stopPropagation();
        // Prevents document event handlers from executing because box-annotations relies on
        // detecting clicks on the document outside of annotation targets to determine when to
        // deselect annotations. This link also may represent that annotation target in the sidebar.
        event.nativeEvent.stopImmediatePropagation();

        onClick(id);
    };
    return (
        <PlainButton className="bcs-AnnotationActivity-link" onClick={handleClick} type={ButtonType.BUTTON}>
            <FormattedMessage {...message} />
        </PlainButton>
    );
};

export default AnnotationActivityLink;
