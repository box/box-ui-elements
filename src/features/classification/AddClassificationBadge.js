// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import IconSecurityClassification from '../../icons/general/IconSecurityClassification';
import { bdlGray62 } from '../../styles/variables';
import messages from './messages';
import './AddClassificationBadge.scss';

const AddClassificationBadge = () => (
    <h1 className="bdl-AddClassificationBadge">
        <IconSecurityClassification color={bdlGray62} height={10} width={10} />
        <FormattedMessage {...messages.addClassification}>
            {value => <span className="bdl-AddClassificationBadge-name">{value}</span>}
        </FormattedMessage>
    </h1>
);

export default AddClassificationBadge;
