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
    ...rest
}: AnnotationActivityLinkProps): JSX.Element => {
    const handleClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.focus(); // Buttons do not receive focus in Firefox and Safari on MacOS

        onClick(id);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
            return;
        }

        // Prevents document event handlers from executing because box-annotations relies on
        // detecting mouse events on the document outside of annotation targets to determine when to
        // deselect annotations. This link also may represent that annotation target in the sidebar.
        event.nativeEvent.stopImmediatePropagation();
    };

    return (
        <PlainButton
            className="bcs-AnnotationActivity-link"
            isDisabled={isDisabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            type={ButtonType.BUTTON}
            {...rest}
        >
            <FormattedMessage {...message} />
        </PlainButton>
    );
};

export default AnnotationActivityLink;
