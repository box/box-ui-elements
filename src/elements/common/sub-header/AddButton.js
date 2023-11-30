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
import { bdlGray65 } from '../../../styles/variables';
import './AddButton.scss';

const AddButton = (props: ?Object) => (
    <Tooltip text={<FormattedMessage {...messages.add} />}>
        <Button aria-label={messages.add.defaultMessage} className="be-btn-add" type="button" {...props}>
            <IconAddThin color={bdlGray65} />
        </Button>
    </Tooltip>
);

export default AddButton;
