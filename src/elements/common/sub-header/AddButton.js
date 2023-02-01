/**
 * @flow
 * @file Add Button component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../components/button';
import IconAddThin from '../../../icons/general/IconAddThin';
import messages from '../messages';
import Tooltip from '../Tooltip';
import { bdlGray62 } from '../../../styles/variables';
import './AddButton.scss';

const AddButton = (props: ?Object) => (
    <Tooltip text={<FormattedMessage {...messages.add} />}>
        <Button className="be-btn-add" aria-label={messages.add.defaultMessage} type="button" {...props}>
            <IconAddThin color={bdlGray62} />
        </Button>
    </Tooltip>
);

export default AddButton;
