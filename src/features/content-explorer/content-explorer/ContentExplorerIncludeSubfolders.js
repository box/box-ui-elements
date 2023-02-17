import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Tooltip from '../../../components/tooltip';
import Toggle from '../../../components/toggle';
import messages from '../messages';
import InfoBadge16 from '../../../icon/fill/InfoBadge16';

const ContentExplorerIncludeSubfolders = ({ isToggleDisabled, onIncludeSubfoldersToggle, tooltipMessageForToggle }) => (
    <div className="bdl-ContentExplorerIncludeSubfolders">
        <div className="bdl-ContentExplorerIncludeSubfolders-toggleIconContainer">
            <Toggle
                className="bdl-ContentExplorerIncludeSubfolders-toggle"
                label={<FormattedMessage {...messages.includeSubfolders} />}
                isDisabled={isToggleDisabled}
                onChange={onIncludeSubfoldersToggle}
            />
            <Tooltip text={<FormattedMessage {...tooltipMessageForToggle} />}>
                <InfoBadge16 className="bdl-ContentExplorerIncludeSubfolders-icon" fill="blue" />
            </Tooltip>
        </div>
    </div>
);

ContentExplorerIncludeSubfolders.propTypes = {
    isToggleDisabled: PropTypes.bool,
    onIncludeSubfoldersToggle: PropTypes.func,
    tooltipMessageForToggle: PropTypes.object,
};

export { ContentExplorerIncludeSubfolders as ContentExplorerIncludeSubfoldersBase };
export default injectIntl(ContentExplorerIncludeSubfolders);
