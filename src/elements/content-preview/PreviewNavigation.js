/**
 * @flow
 * @file Preview Navigation
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Route } from 'react-router-dom';
import type { InjectIntlProvidedProps } from 'react-intl';
import IconNavigateLeft from '../../icons/general/IconNavigateLeft';
import IconNavigateRight from '../../icons/general/IconNavigateRight';
import PlainButton from '../../components/plain-button/PlainButton';
import messages from '../common/messages';
import type { BoxItem } from '../../common/types/core';

type Props = {
    collection: Array<string | BoxItem>,
    currentIndex: number,
    onNavigateLeft: Function,
    onNavigateRight: Function,
} & InjectIntlProvidedProps;

const PreviewNavigation = ({ collection = [], currentIndex, intl, onNavigateLeft, onNavigateRight }: Props) => {
    const hasLeftNavigation = collection.length > 1 && currentIndex > 0 && currentIndex < collection.length;
    const hasRightNavigation = collection.length > 1 && currentIndex > -1 && currentIndex < collection.length - 1;

    if (!hasLeftNavigation && !hasRightNavigation) {
        return null;
    }

    return (
        <Route path={['/:activeTab/:deeplink', '/']}>
            {({ match, history }) => (
                <>
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
    );
};

export { PreviewNavigation as PreviewNavigationComponent };
export default injectIntl(PreviewNavigation);
