// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';
import PlainButton from '../../../../components/plain-button';

type Props = {
    id: string,
    message: MessageDescriptor,
    onClick: (id: string) => void,
};

const AnnotationActivityLink = ({ id, message, onClick = noop }: Props): React.Node => {
    const handleClick = event => {
        event.preventDefault();

        onClick(id);
    };
    return (
        <PlainButton className="bcs-AnnotationActivity-link" onClick={handleClick}>
            <FormattedMessage {...message} />
        </PlainButton>
    );
};

export default AnnotationActivityLink;
