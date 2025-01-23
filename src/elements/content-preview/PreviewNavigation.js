/**
 * @file Preview Navigation
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import CustomRoute from '../common/routing/customRoute';
import IconNavigateLeft from '../../icons/general/IconNavigateLeft';
import IconNavigateRight from '../../icons/general/IconNavigateRight';
import PlainButton from '../../components/plain-button/PlainButton';
import messages from '../common/messages';
import { SIDEBAR_VIEW_METADATA } from '../../constants';

/**
 * @typedef {Object} Props
 * @property {Array<string|import('../../common/types/core').BoxItem>} collection
 * @property {number} currentIndex
 * @property {import('react-intl').IntlShape} intl
 * @property {Function} onNavigateLeft
 * @property {Function} onNavigateRight
 */

/** @type {React.FC<Props>} */
const PreviewNavigation = ({ collection = [], currentIndex, intl, onNavigateLeft, onNavigateRight }) => {
    const hasLeftNavigation = collection.length > 1 && currentIndex > 0 && currentIndex < collection.length;
    const hasRightNavigation = collection.length > 1 && currentIndex > -1 && currentIndex < collection.length - 1;

    if (!hasLeftNavigation && !hasRightNavigation) {
        return null;
    }

    const goToActiveSidebarTab = (routeParams, history) => {
        if (routeParams.deeplink) {
            if (routeParams.activeTab === SIDEBAR_VIEW_METADATA) {
                // Preserve the full path for metadata routes
                const fullPath = routeParams[0] || '';
                history.push(`/${routeParams.activeTab}/${routeParams.deeplink}/${fullPath}`);
            } else {
                history.push(`/${routeParams.activeTab}`);
            }
        }
    };

    return (
        <CustomRoute path={['/:activeTab/:deeplink/*', '/']}>
            {({ match, history }) => (
                <>
                    {hasLeftNavigation && (
                        <PlainButton
                            className="bcpr-navigate-left"
                            onClick={() => {
                                goToActiveSidebarTab(match.params, history);
                                onNavigateLeft();
                            }}
                            title={intl.formatMessage(messages.previousFile)}
                            type="button"
                        >
                            <IconNavigateLeft />
                        </PlainButton>
                    )}
                    {hasRightNavigation && (
                        <PlainButton
                            className="bcpr-navigate-right"
                            onClick={() => {
                                goToActiveSidebarTab(match.params, history);
                                onNavigateRight();
                            }}
                            title={intl.formatMessage(messages.nextFile)}
                            type="button"
                        >
                            <IconNavigateRight />
                        </PlainButton>
                    )}
                </>
            )}
        </CustomRoute>
    );
};

export { PreviewNavigation as PreviewNavigationComponent };
export default injectIntl(PreviewNavigation);
