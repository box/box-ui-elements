import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Checkbox from '../../../components/checkbox/Checkbox';
import Tooltip from '../../../components/tooltip';
import Toggle from '../../../components/toggle';

import messages from '../messages';
import IconInfo from '../../../icons/general/IconInfo';

const ContentExplorerIncludeSubfolders = ({
    isFolderPresent,
    handleIncludeSubfoldersToggle,
    handleSelectAllClick,
    hideSelectAllCheckbox,
    isSelectAllChecked,
    noFoldersSelected,
    numOfSelectedItems = 0,
    isToggleDisabled,
}) => {
    const getTooltipMessage = () => {
        if (numOfSelectedItems > 1) {
            return <FormattedMessage {...messages.includeSubfoldersMultipleFoldersSelected} />;
        }
        if (numOfSelectedItems === 1 && noFoldersSelected) {
            return <FormattedMessage {...messages.includeSubfoldersNoFoldersSelected} />;
        }
        if (numOfSelectedItems === 0 && !isFolderPresent) {
            return <FormattedMessage {...messages.includeSubfoldersNoFoldersToSelect} />;
        }
        return <FormattedMessage {...messages.includeSubfoldersDefaultInformation} />;
    };

    return (
        <div className="bdl-ContentExplorerIncludeSubfolders">
            <Toggle
                className="bdl-ContentExplorerIncludeSubfolders-toggle"
                label={<FormattedMessage {...messages.includeSubfolders} />}
                isDisabled={isToggleDisabled}
                onChange={handleIncludeSubfoldersToggle}
            />

            <Tooltip className="bdl-ContentExplorerIncludeSubfolders-info-tooltip" text={getTooltipMessage()}>
                <div className="bdl-ContentExplorerIncludeSubfolders-icon-container">
                    <IconInfo className="bdl-ContentExplorerIncludeSubfolders-icon" height={20} width={20} />
                </div>
            </Tooltip>

            {!hideSelectAllCheckbox && (
                <Tooltip text={<FormattedMessage {...messages.selectAll} />}>
                    <Checkbox
                        hideLabel
                        className="bdl-ContentExplorerIncludeSubfolders-checkbox"
                        onChange={handleSelectAllClick}
                        isChecked={isSelectAllChecked}
                    />
                </Tooltip>
            )}
        </div>
    );
};

ContentExplorerIncludeSubfolders.propTypes = {
    isFolderPresent: PropTypes.bool,
    handleIncludeSubfoldersToggle: PropTypes.func,
    handleSelectAllClick: PropTypes.func,
    hideSelectAllCheckbox: PropTypes.bool,
    isSelectAllChecked: PropTypes.bool,
    noFoldersSelected: PropTypes.bool,
    numOfSelectedItems: PropTypes.number,
    isToggleDisabled: PropTypes.bool,
};
export { ContentExplorerIncludeSubfolders as ContentExplorerIncludeSubfoldersBase };
export default injectIntl(ContentExplorerIncludeSubfolders);
