// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';
import NavButton from '../../../common/nav-button';
import { Link } from '../../../../components/link';

type Props = {
    href?: string,
    id: string,
    message: MessageDescriptor,
    onClick: (id: string) => void,
};

const AnnotationActivityLink = ({ href, id, message, onClick = noop }: Props): React.Node => {
    const handleClick = event => {
        event.preventDefault();

        onClick(id);
    };
    return (
        <NavButton component={Link} className="bcs-AnnotationActivity-link" onClick={handleClick} href={href}>
            <FormattedMessage {...message} />
        </NavButton>
    );
};

export default AnnotationActivityLink;
