/**
 * @flow
 * @file Open With button
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import './BoxToolsInstallMessage.scss';

const DEFAULT_BOX_TOOLS_INSTALLATION_URL =
    'https://community.box.com/t5/Using-Box-Tools/Installing-Box-Tools/ta-p/50143';

const onLinkClick = () => {
    // Manually open the URL since disabled menu items are normally prevented from clickable actions
    window.open(DEFAULT_BOX_TOOLS_INSTALLATION_URL);
};

const BoxToolsInstallMessage = () => {
    return (
        <FormattedMessage
            {...messages.boxToolsInstallMessage}
            values={{
                boxTools: (
                    /* eslint-disable jsx-a11y/anchor-is-valid */
                    <a onClick={onLinkClick} href="#" rel="noopener noreferrer">
                        {' '}
                        Box Tools
                    </a>
                    /* eslint-enable jsx-a11y/anchor-is-valid */
                ),
            }}
        />
    );
};

export default BoxToolsInstallMessage;
