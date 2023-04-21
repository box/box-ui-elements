import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Checkbox from '../../../components/checkbox/Checkbox';
import Tooltip from '../../../components/tooltip';
import messages from '../messages';

const ContentExplorerSelectAll = ({
    handleSelectAllClick,
    intl,
    isLabelHidden,
    isSelectAllChecked,
    numTotalItems = 0,
}) => (
    <div className="content-explorer-select-all-container">
        {!isLabelHidden && (
            <label className="content-explorer-select-all-items-counter">
                {numTotalItems === 1 ? (
                    <FormattedMessage {...messages.result} values={{ itemsCount: intl.formatNumber(numTotalItems) }} />
                ) : (
                    <FormattedMessage {...messages.results} values={{ itemsCount: intl.formatNumber(numTotalItems) }} />
                )}
            </label>
        )}
        {!isLabelHidden && (
            <label className="content-explorer-select-all-checkbox-label">
                <FormattedMessage {...messages.selectAll} />
            </label>
        )}
        <Tooltip isShown={isLabelHidden ? undefined : false} text={<FormattedMessage {...messages.selectAll} />}>
            <Checkbox
                hideLabel
                className="content-explorer-select-all-checkbox"
                onChange={handleSelectAllClick}
                isChecked={isSelectAllChecked}
            />
        </Tooltip>
    </div>
);

ContentExplorerSelectAll.propTypes = {
    handleSelectAllClick: PropTypes.func,
    intl: PropTypes.any,
    isSelectAllChecked: PropTypes.bool,
    isLabelHidden: PropTypes.bool,
    numTotalItems: PropTypes.number,
};

export { ContentExplorerSelectAll as ContentExplorerSelectAllBase };
export default injectIntl(ContentExplorerSelectAll);
