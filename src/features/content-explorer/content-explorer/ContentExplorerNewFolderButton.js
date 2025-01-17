import PropTypes from 'prop-types';
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import Button from '../../../components/button';

import { ContentExplorerModePropType } from '../prop-types';
import ContentExplorerModes from '../modes';
// eslint-disable-next-line import/no-named-as-default
import messages from '../messages';

const ContentExplorerNewFolderButton = ({
    contentExplorerMode,
    intl,
    onClick,
    isDisabled = false,
    isCreateNewFolderAllowed = true,
}) => {
    const doesModeAllowCreateNewFolder =
        contentExplorerMode === ContentExplorerModes.COPY ||
        contentExplorerMode === ContentExplorerModes.MOVE_COPY ||
        contentExplorerMode === ContentExplorerModes.MULTI_SELECT ||
        contentExplorerMode === ContentExplorerModes.SELECT_FOLDER;

    return doesModeAllowCreateNewFolder ? (
        <Button
            className="content-explorer-new-folder-button"
            type="button"
            onClick={onClick}
            isDisabled={isDisabled}
            title={!isCreateNewFolderAllowed ? intl.formatMessage(messages.newFolderForbidden) : ''}
        >
            <FormattedMessage {...messages.newFolder} />
        </Button>
    ) : null;
};

ContentExplorerNewFolderButton.propTypes = {
    contentExplorerMode: ContentExplorerModePropType.isRequired,
    intl: PropTypes.any,
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
    isCreateNewFolderAllowed: PropTypes.bool,
};

export { ContentExplorerNewFolderButton as ContentExplorerNewFolderButtonBase };
export default injectIntl(ContentExplorerNewFolderButton);
