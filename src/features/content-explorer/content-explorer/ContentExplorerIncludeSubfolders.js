import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Checkbox from '../../../components/checkbox/Checkbox';
import Tooltip from '../../../components/tooltip';
import Toggle from '../../../components/toggle';

import messages from '../messages';
import IconInfo from '../../../icons/general/IconInfo';

const ContentExplorerIncludeSubfolders = ({
    foldersPresent,
    handleIncludeSubfoldersToggle,
    handleSelectAllClick,
    hideSelectAllCheckbox,
    isSelectAllChecked,
    noFoldersSelected,
    numOfSelectedItems = 0,
    toggleIsDisabled,
}) => {
    const getTooltipMessage = () => {
        if (numOfSelectedItems > 1) {
            return <FormattedMessage {...messages.includeSubfoldersMultipleFoldersSelected} />;
        }
        if (numOfSelectedItems === 1 && noFoldersSelected) {
            return <FormattedMessage {...messages.includeSubfoldersNoFoldersSelected} />;
        }
        if (numOfSelectedItems === 0 && !foldersPresent) {
            return <FormattedMessage {...messages.includeSubfoldersNoFoldersToSelect} />;
        }
        return <FormattedMessage {...messages.includeSubfoldersDefaultInformation} />;
    };

    return (
        <div className="content-explorer-include-subfolders-container">
            <Toggle
                className="include-subfolders-toggle"
                label={<FormattedMessage {...messages.includeSubfolders} />}
                isDisabled={toggleIsDisabled}
                onChange={handleIncludeSubfoldersToggle}
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
    handleSelectAllClick: PropTypes.func,
    hideSelectAllCheckbox: PropTypes.bool,
    isSelectAllChecked: PropTypes.bool,
    noFoldersSelected: PropTypes.bool,
    numOfSelectedItems: PropTypes.number,
    toggleIsDisabled: PropTypes.bool,
};
export { ContentExplorerIncludeSubfolders as ContentExplorerIncludeSubfoldersBase };
export default injectIntl(ContentExplorerIncludeSubfolders);
