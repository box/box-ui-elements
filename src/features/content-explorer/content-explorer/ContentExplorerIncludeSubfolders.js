import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Checkbox from '../../../components/checkbox/Checkbox';
import Tooltip from '../../../components/tooltip';
import Toggle from '../../../components/toggle';
import messages from '../messages';
import InfoBadge16 from '../../../icon/fill/InfoBadge16';

const ContentExplorerIncludeSubfolders = ({
    hideSelectAllCheckbox,
    isSelectAllChecked,
    isToggleDisabled,
    onIncludeSubfoldersToggle,
    onSelectAllClick,
    tooltipMessageForToggle,
}) => (
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
        {!hideSelectAllCheckbox && (
            <Tooltip text={<FormattedMessage {...messages.selectAll} />}>
                <Checkbox
                    hideLabel
                    className="bdl-ContentExplorerIncludeSubfolders-checkbox"
                    onChange={onSelectAllClick}
                    isChecked={isSelectAllChecked}
                />
            </Tooltip>
        )}
    </div>
);

ContentExplorerIncludeSubfolders.propTypes = {
    hideSelectAllCheckbox: PropTypes.bool,
    isFolderPresent: PropTypes.bool,
    isSelectAllChecked: PropTypes.bool,
    isToggleDisabled: PropTypes.bool,
    noFoldersSelected: PropTypes.bool,
    onIncludeSubfoldersToggle: PropTypes.func,
    onSelectAllClick: PropTypes.func,
    numOfSelectedItems: PropTypes.number,
    tooltipMessageForToggle: PropTypes.object,
};

export { ContentExplorerIncludeSubfolders as ContentExplorerIncludeSubfoldersBase };
export default injectIntl(ContentExplorerIncludeSubfolders);
