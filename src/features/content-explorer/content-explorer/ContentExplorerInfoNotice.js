import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { InlineNotice } from '@box/blueprint-web';

import messages from '../messages';

const ContentExplorerInfoNotice = ({ infoNoticeText, intl }) => (
    <InlineNotice
        variant="info"
        variantIconAriaLabel={intl.formatMessage(messages.infoNoticeIconAriaLabel)}
        className="content-explorer-info-notice"
    >
        {infoNoticeText}
    </InlineNotice>
);

ContentExplorerInfoNotice.propTypes = {
    infoNoticeText: PropTypes.string.isRequired,
};

export { ContentExplorerInfoNotice as ContentExplorerInfoNoticeBase };
export default injectIntl(ContentExplorerInfoNotice);
