/**
 * @flow
 * @file Preview Navigation
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Route } from 'react-router-dom';
import IconNavigateLeft from '../../icons/general/IconNavigateLeft';
import IconNavigateRight from '../../icons/general/IconNavigateRight';
import PlainButton from '../../components/plain-button/PlainButton';
import messages from '../common/messages';
import type { BoxItem } from '../../common/types/core';
import { SIDEBAR_VIEW_METADATA } from '../../constants';

type Props = {
    collection: Array<string | BoxItem>,
    currentIndex: number,
    intl: IntlShape,
    onNavigateLeft: Function,
    onNavigateRight: Function,
};

const PreviewNavigation = ({ collection = [], currentIndex, intl, onNavigateLeft, onNavigateRight }: Props) => {
    const hasLeftNavigation = collection.length > 1 && currentIndex > 0 && currentIndex < collection.length;
    const hasRightNavigation = collection.length > 1 && currentIndex > -1 && currentIndex < collection.length - 1;

    if (!hasLeftNavigation && !hasRightNavigation) {
        return null;
    }

    const goToActiveSidebarTab = (routeParams, history) => {
        if (routeParams.deeplink) {
            if (routeParams.activeTab === SIDEBAR_VIEW_METADATA) {
                history.push(`/${routeParams.activeTab}/${routeParams.deeplink}/${routeParams[0]}`);
            } else {
                history.push(`/${routeParams.activeTab}`);
            }
        }
    };

    return (
        <Route path={['/:activeTab/:deeplink/*', '/']}>
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
        </Route>
    );
};

export { PreviewNavigation as PreviewNavigationComponent };
export default injectIntl(PreviewNavigation);
