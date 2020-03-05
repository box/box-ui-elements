// @flow
import * as React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import './SecurityControlsItem.scss';

type Props = {
    message: MessageDescriptor,
};

const SecurityControlsItem = ({ message }: Props) => {
    return (
        <li className="bdl-SecurityControlsItem">
            <FormattedMessage {...message} />
        </li>
    );
};

export default SecurityControlsItem;
