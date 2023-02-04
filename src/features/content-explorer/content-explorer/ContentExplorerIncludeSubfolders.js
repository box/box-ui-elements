import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Checkbox from '../../../components/checkbox/Checkbox';
import Tooltip from '../../../components/tooltip';
import Toggle from '../../../components/toggle';

import messages from '../messages';
import IconInfo from '../../../icons/general/IconInfo';

const ContentExplorerIncludeSubfolders = ({
    numOfSelectedItems = 0,
    isSelectAllChecked,
    foldersPresent,
    handleIncludeSubfoldersToggle,
    handleSelectAllClick,
    hideSelectAllCheckbox,
    noFoldersSelected,
    toggleIsDisabled,
}) => {
    const getTooltipMessage = () => {
        if (numOfSelectedItems > 1) {
            return <FormattedMessage {...messages.includeSubfodlersMultipleFoldersSelected} />;
        }
        if (numOfSelectedItems === 1 && noFoldersSelected) {
            return <FormattedMessage {...messages.includeSubfodlersNoFoldersSelected} />;
        }
        if (numOfSelectedItems === 0 && !foldersPresent) {
            return <FormattedMessage {...messages.includeSubfodlersNoFoldersToSelect} />;
        }
        return <FormattedMessage {...messages.includeSubfolders} />;
    };

    return (
        <div className="content-explorer-include-subfolders-container">
            <Toggle
                className="include-subfolders-toggle"
                label="Include Subfolders"
                isDisabled={toggleIsDisabled}
                onChange={() => handleIncludeSubfoldersToggle()}
            />

            <Tooltip className="info-icon-tooltip" text={getTooltipMessage()}>
                <div className="include-subfolders-info-icon-container">
                    <IconInfo className="include-subfolders-info-icon" height={20} width={20} />
                </div>
            </Tooltip>

            {!hideSelectAllCheckbox && (
                <Tooltip text={<FormattedMessage {...messages.selectAll} />}>
                    <Checkbox
                        hideLabel
                        className="content-explorer-include-subfolders-select-all-checkbox"
                        onChange={handleSelectAllClick}
                        isChecked={isSelectAllChecked}
                    />
                </Tooltip>
            )}
        </div>
    );
};

ContentExplorerIncludeSubfolders.propTypes = {
    foldersPresent: PropTypes.bool,
    handleIncludeSubfoldersToggle: PropTypes.func,
    numOfSelectedItems: PropTypes.number,
    isSelectAllChecked: PropTypes.bool,
    handleSelectAllClick: PropTypes.func,
    hideSelectAllCheckbox: PropTypes.bool,
    noFoldersSelected: PropTypes.bool,
    toggleIsDisabled: PropTypes.bool,
};
export { ContentExplorerIncludeSubfolders as ContentExplorerIncludeSubfoldersBase };
export default injectIntl(ContentExplorerIncludeSubfolders);
