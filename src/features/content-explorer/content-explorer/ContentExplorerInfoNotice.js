import * as React from 'react';
import PropTypes from 'prop-types';

import { InfoBadge } from '@box/blueprint-web-assets/icons/Line';

import InlineNotice from '../../../components/inline-notice';

const ContentExplorerInfoNotice = ({ infoNoticeText }) => (
    <InlineNotice type="info" className="content-explorer-info-notice">
        <div className="content-explorer-info-notice-flex-container">
            <InfoBadge className="content-explorer-info-notice-icon" />
            <p>{infoNoticeText}</p>
        </div>
    </InlineNotice>
);

ContentExplorerInfoNotice.propTypes = {
    infoNoticeText: PropTypes.string.isRequired,
};

export default ContentExplorerInfoNotice;
