import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { injectIntl, MessageDescriptor, WrappedComponentProps } from 'react-intl';
import PlainButton from '../../../../components/plain-button';
import { ButtonType } from '../../../../components/button';
import './AnnotationActivityLink.scss';

type MessageDescriptorWithValues = {
    values?: Record<string, number>;
} & MessageDescriptor;
export interface AnnotationActivityLinkProps extends WrappedComponentProps {
    className?: string;
    id: string;
    isDisabled: boolean;
    message: MessageDescriptorWithValues;
    onClick: (id: string) => void;
}

const AnnotationActivityLink = ({
    className,
    id,
    intl,
    isDisabled = false,
    message,
    onClick = noop,
    ...rest
}: AnnotationActivityLinkProps): React.ReactElement => {
    const { values, ...messageDescriptor } = message;
    const translatedMessage = intl.formatMessage(messageDescriptor, values);

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
            className={classNames('bcs-AnnotationActivityLink', className)}
            data-testid="bcs-AnnotationActivity-link"
            isDisabled={isDisabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            title={translatedMessage}
            type={ButtonType.BUTTON}
            {...rest}
        >
            <span className="bcs-AnnotationActivityLink-message">{translatedMessage}</span>
        </PlainButton>
    );
};

export { AnnotationActivityLink as AnnotationActivityLinkBase };

export default injectIntl(AnnotationActivityLink);
