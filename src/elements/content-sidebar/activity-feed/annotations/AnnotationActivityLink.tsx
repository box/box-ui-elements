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
    const handleClick = () => {
        onClick(id);
    };
    return (
        <PlainButton className="bcs-AnnotationActivity-link" onClick={handleClick} type={ButtonType.BUTTON}>
            <FormattedMessage {...message} />
        </PlainButton>
    );
};

export default AnnotationActivityLink;
