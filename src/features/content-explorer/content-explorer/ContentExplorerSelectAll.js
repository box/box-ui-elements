import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Checkbox from '../../../components/checkbox/Checkbox';

import messages from '../messages';

const ContentExplorerSelectAll = ({ intl, numTotalItems = 0, isSelectAllChecked, handleSelectAllClick }) => (
    <div className="content-explorer-select-all-container">
        <label className="content-explorer-select-all-items-counter">
            {numTotalItems === 1 ? (
                <FormattedMessage {...messages.result} values={{ itemsCount: intl.formatNumber(numTotalItems) }} />
            ) : (
                <FormattedMessage {...messages.results} values={{ itemsCount: intl.formatNumber(numTotalItems) }} />
            )}
        </label>
        <label className="content-explorer-select-all-checkbox-label">
            <FormattedMessage {...messages.selectAll} />
        </label>
        <Checkbox
            hideLabel
            className="content-explorer-select-all-checkbox"
            onChange={handleSelectAllClick}
            isChecked={isSelectAllChecked}
        />
    </div>
);

ContentExplorerSelectAll.propTypes = {
    intl: PropTypes.any,
    numTotalItems: PropTypes.number,
    isSelectAllChecked: PropTypes.bool,
    handleSelectAllClick: PropTypes.func,
};
export { ContentExplorerSelectAll as ContentExplorerSelectAllBase };
export default injectIntl(ContentExplorerSelectAll);
