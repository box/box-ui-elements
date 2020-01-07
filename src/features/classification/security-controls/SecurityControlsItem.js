// @flow
import * as React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import { bdlYellorange } from '../../../styles/variables';
import IconSecurityClassificationSolid from '../../../icons/general/IconSecurityClassificationSolid';

import './SecurityControlsItem.scss';

type Props = {
    message: MessageDescriptor,
};

const SecurityControlsItem = ({ message }: Props) => (
    <li className="bdl-SecurityControlsItem">
        <IconSecurityClassificationSolid color={bdlYellorange} height={11} width={11} strokeWidth={3} />
        <FormattedMessage {...message} />
    </li>
);

export default SecurityControlsItem;
