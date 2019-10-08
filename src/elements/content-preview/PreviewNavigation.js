/**
 * @flow
 * @file Preview Navigation
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Route } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import NavRouter from '../common/nav-router';
import IconNavigateLeft from '../../icons/general/IconNavigateLeft';
import IconNavigateRight from '../../icons/general/IconNavigateRight';
import PlainButton from '../../components/plain-button/PlainButton';
import messages from '../common/messages';

type Props = {
    collection: Array<string | BoxItem>,
    currentIndex: number,
    history: RouterHistory,
    onNavigateLeft: Function,
    onNavigateRight: Function,
} & InjectIntlProvidedProps;

const PreviewNavigation = ({
    collection = [],
    currentIndex,
    intl,
    onNavigateLeft,
    onNavigateRight,
    history,
}: Props) => {
    const hasLeftNavigation = collection.length > 1 && currentIndex > 0 && currentIndex < collection.length;
    const hasRightNavigation = collection.length > 1 && currentIndex > -1 && currentIndex < collection.length - 1;

    if (!hasLeftNavigation && !hasRightNavigation) {
        return null;
    }

    return (
        <NavRouter history={history}>
            <Route path={['/:activeTab/:deeplink', '/']}>
                {({ match }) => (
                    <>
                        {/* {console.log(match)} */}
                        {hasLeftNavigation && (
                            <PlainButton
                                className="bcpr-navigate-left"
                                onClick={() => {
                                    if (match.params.deeplink) {
                                        history.push(`/${match.params.activeTab}`);
                                    }
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
                                    if (match.params.deeplink) {
                                        history.push(`/${match.params.activeTab}`);
                                    }

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
        </NavRouter>
    );
};

export { PreviewNavigation as PreviewNavigationComponent };
export default injectIntl(PreviewNavigation);
