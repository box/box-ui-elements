import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import InlineNotice from '../../components/inline-notice';

import messages from './messages';

const SharedLinkExpirationNotice = ({ expiration }) => (
    <InlineNotice>
        <FormattedMessage {...messages.sharedLinkExpiration} values={{ expiration }} />
    </InlineNotice>
);

SharedLinkExpirationNotice.propTypes = {
    /** a localized, human-readable string/node representing the expiration date */
    expiration: PropTypes.node.isRequired,
};

export default SharedLinkExpirationNotice;
