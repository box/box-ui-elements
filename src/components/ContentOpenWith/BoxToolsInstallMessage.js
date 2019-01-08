/**
 * @flow
 * @file Custom message to install Box Tools inside of Open With.
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import './BoxToolsInstallMessage.scss';

const DEFAULT_BOX_TOOLS_INSTALLATION_URL = 'https://cloud.box.com/v/installboxtools';

const onLinkClick = () => {
    // Manually open the URL since disabled menu items are blocked from clickable actions by default
    window.open(DEFAULT_BOX_TOOLS_INSTALLATION_URL);
};

const BoxToolsInstallMessage = () => {
    return (
        <FormattedMessage
            {...messages.boxToolsInstallMessage}
            values={{
                boxTools: (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a onClick={onLinkClick} href="#" rel="noopener noreferrer">
                        {'Box Tools'}
                    </a>
                ),
            }}
        />
    );
};

export default BoxToolsInstallMessage;
