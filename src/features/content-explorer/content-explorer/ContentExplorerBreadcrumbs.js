import PropTypes from 'prop-types';
import * as React from 'react';
import { injectIntl } from 'react-intl';

import Button from '../../../components/button';
import Breadcrumb from '../../../components/breadcrumb';
import IconChevron from '../../../icons/general/IconChevron';
import IconAllFiles from '../../../icons/general/IconAllFiles';
import PlainButton from '../../../components/plain-button';

import { FoldersPathPropType } from '../prop-types';
// eslint-disable-next-line import/no-named-as-default
import messages from '../messages';

const ContentExplorerBreadcrumbs = ({
    breadcrumbProps,
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
        <Breadcrumb label={formatMessage(messages.breadcrumb)} {...breadcrumbProps}>
            {/* The outer div for each crumb prevents styling conflicts when the crumbs menu is active */}
            {foldersPath.map((folder, i) => (
                <div key={folder.id} className="lnk">
                    <PlainButton
                        className="bdl-ContentExplorerBreadcrumbs-crumbLink"
                        data-testid="breadcrumb-lnk"
                        onClick={event => onBreadcrumbClick(i, event)}
                        title={folder.name}
                    >
                        {i === 0 && <IconAllFiles />}
                        <span>{folder.name}</span>
                    </PlainButton>
                </div>
            ))}
        </Breadcrumb>
    </div>
);

ContentExplorerBreadcrumbs.propTypes = {
    breadcrumbProps: PropTypes.object,
    foldersPath: FoldersPathPropType.isRequired,
    intl: PropTypes.any,
    isUpButtonDisabled: PropTypes.bool,
    onUpButtonClick: PropTypes.func,
    onBreadcrumbClick: PropTypes.func,
};

export { ContentExplorerBreadcrumbs as ContentExplorerBreadcrumbsBase };
export default injectIntl(ContentExplorerBreadcrumbs);
