// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import './AddClassificationBadge.scss';

const AddClassificationBadge = () => (
    <h1 className="bdl-AddClassificationBadge">
        <FormattedMessage {...messages.addClassification}>
            {value => <span className="bdl-AddClassificationBadge-name">{value}</span>}
        </FormattedMessage>
    </h1>
);

export default AddClassificationBadge;
