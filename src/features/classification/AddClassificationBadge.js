// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import IconAddTags from '../../icons/general/IconAddTags';
import { bdlGray50 } from '../../styles/variables';
import messages from './messages';
import './AddClassificationBadge.scss';

const AddClassificationBadge = () => (
    <h1 className="bdl-AddClassificationBadge">
        <IconAddTags color={bdlGray50} height={10} width={10} strokeWidth={3} />
        <FormattedMessage {...messages.addClassification}>
            {value => <span className="bdl-AddClassificationBadge-name">{value}</span>}
        </FormattedMessage>
    </h1>
);

export default AddClassificationBadge;
