import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import PlainButton from '../../../../components/plain-button';
import { ButtonType } from '../../../../components/button';
import useSuppressiveClicks from './useSuppresiveClicks';

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
    const handlers = useSuppressiveClicks<HTMLButtonElement>({ isDisabled, onClick: () => onClick(id) });

    return (
        <PlainButton
            className="bcs-AnnotationActivity-link"
            data-testid="bcs-AnnotationActivity-link"
            isDisabled={isDisabled}
            type={ButtonType.BUTTON}
            {...rest}
            {...handlers}
        >
            <FormattedMessage {...message} />
        </PlainButton>
    );
};

export default AnnotationActivityLink;
