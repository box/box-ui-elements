import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import FolderEmptyState from '../../../icons/states/FolderEmptyState';
import SearchEmptyState from '../../../icons/states/SearchEmptyState';

import messages from '../messages';

const ContentExplorerEmptyState = ({ isSearch = false }) => (
    <div className="content-explorer-empty-state themed">
        {isSearch ? <SearchEmptyState /> : <FolderEmptyState />}
        <span className="content-explorer-empty-state-text">
            {isSearch ? <FormattedMessage {...messages.emptySearch} /> : <FormattedMessage {...messages.emptyFolder} />}
        </span>
    </div>
);

ContentExplorerEmptyState.propTypes = {
    isSearch: PropTypes.bool,
};

export default ContentExplorerEmptyState;
