/**
 * @flow
 * @file Sort Button component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../../components/button';
import IconSort from '../../../icons/general/IconSort';
import messages from '../messages';
import Tooltip from '../Tooltip';
import './SortButton.scss';

const SortButton = (props: ?Object) => (
    <Tooltip text={<FormattedMessage {...messages.sort} />}>
        <Button className="be-btn-sort" type="button" {...props}>
            <IconSort />
        </Button>
    </Tooltip>
);

export default SortButton;
