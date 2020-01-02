// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import { bdlYellorange } from '../../../styles/variables';
import IconSecurityClassification from '../../../icons/general/IconSecurityClassification';

import './SecurityControlsItem.scss';

type Props = {
    message: MessageDescriptor,
};

const SecurityControlsItem = ({ message }: Props) => (
    <li className="bdl-SecurityControlsItem">
        <IconSecurityClassification color={bdlYellorange} height={11} width={11} strokeWidth={3} className="reverse" />
        <FormattedMessage {...message} />
    </li>
);

export default SecurityControlsItem;
