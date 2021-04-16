import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Checkbox from '../../../components/checkbox/Checkbox';

import messages from '../messages';

class ContentExplorerSelectAll extends PureComponent {
    static propTypes = {
        intl: PropTypes.any,
        numTotalItems: PropTypes.number,
        isSelectAllChecked: PropTypes.bool,
        handleSelectAllClick: PropTypes.any,
    };

    static defaultProps = {
        numTotalItems: 0,
    };

    render() {
        const { intl, numTotalItems, handleSelectAllClick, isSelectAllChecked } = this.props;
        const itemsCount = intl.formatNumber(numTotalItems);
        return (
            <div className="content-explorer-select-all-container">
                <label className="content-explorer-select-all-items-counter">
                    <FormattedMessage {...messages.results} values={{ itemsCount }} />
                </label>
                <label className="content-explorer-select-all-checkbox-lable">
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
    }
}

export { ContentExplorerSelectAll as ContentExplorerSelectAllBase };
export default injectIntl(ContentExplorerSelectAll);
