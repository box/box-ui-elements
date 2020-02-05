import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import Button from '../../../components/button';
import PlainButton from '../../../components/plain-button';
import Breadcrumb from '../../../components/breadcrumb';
import IconChevron from '../../../icons/general/IconChevron';
import IconAllFiles from '../../../icons/general/IconAllFiles';

import { FoldersPathPropType } from '../prop-types';
import messages from '../messages';

const ContentExplorerBreadcrumbs = ({
    foldersPath,
    intl: { formatMessage },
    isUpButtonDisabled = false,
    onUpButtonClick,
    onBreadcrumbClick,
}) => (
    <div className="content-explorer-breadcrumbs-container">
        <Button
            aria-label={formatMessage(messages.clickToGoBack)}
            className="content-explorer-breadcrumbs-up-button"
            type="button"
            onClick={onUpButtonClick}
            isDisabled={isUpButtonDisabled}
        >
            <IconChevron direction="left" size="6px" color="#333" />
        </Button>
        <Breadcrumb label={formatMessage(messages.breadcrumb)}>
            {foldersPath.map((folder, i) => (
                <PlainButton
                    className="lnk"
                    key={folder.id}
                    title={folder.name}
                    onClick={event => onBreadcrumbClick(i, event)}
                >
                    {i === 0 && <IconAllFiles />}
                    <span>{folder.name}</span>
                </PlainButton>
            ))}
        </Breadcrumb>
    </div>
);

ContentExplorerBreadcrumbs.propTypes = {
    foldersPath: FoldersPathPropType.isRequired,
    intl: PropTypes.any,
    isUpButtonDisabled: PropTypes.bool,
    onUpButtonClick: PropTypes.func,
    onBreadcrumbClick: PropTypes.func,
};

export { ContentExplorerBreadcrumbs as ContentExplorerBreadcrumbsBase };
export default injectIntl(ContentExplorerBreadcrumbs);
