/**
 * @flow
 * @file Sort Button component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import Button from '../../../components/button';
import IconSort from '../../../icons/general/IconSort';
import messages from '../messages';
import Tooltip from '../Tooltip';
import './SortButton.scss';

const SortButton = ({ intl, ...rest }: ?Object) => {
    const sortMessage = intl.formatMessage(messages.sort);
    return (
        <Tooltip text={sortMessage}>
            <Button aria-label={sortMessage} className="be-btn-sort" type="button" {...rest}>
                <IconSort />
            </Button>
        </Tooltip>
    );
};

export default injectIntl(SortButton);
