/**
 * @flow
 * @file Add Button component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
// $FlowFixMe migrated to TS
import Button from '../../../components/button'; // eslint-disable-line
import IconAddThin from '../../../icons/general/IconAddThin';
import messages from '../messages';
import Tooltip from '../Tooltip';
import './AddButton.scss';

const AddButton = (props: ?Object) => (
    <Tooltip text={<FormattedMessage {...messages.add} />}>
        <Button className="be-btn-add" aria-label={messages.add.defaultMessage} type="button" {...props}>
            <IconAddThin />
        </Button>
    </Tooltip>
);

export default AddButton;
