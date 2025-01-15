import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { History } from 'history';
import { useMatch } from '../common/nav-router/utils';
import IconNavigateLeft from '../../icons/general/IconNavigateLeft';
import IconNavigateRight from '../../icons/general/IconNavigateRight';
import PlainButton from '../../components/plain-button/PlainButton';
import { ButtonType } from '../../components/button';
import messages from '../common/messages';
import { type BoxItem } from '../../common/types/core';
import { SIDEBAR_VIEW_METADATA } from '../../constants';

interface Props {
    collection: Array<string | BoxItem>;
    currentIndex: number;
    intl: IntlShape;
    history: History;
    onNavigateLeft: () => void;
    onNavigateRight: () => void;
}

const PreviewNavigation = ({
    collection = [],
    currentIndex,
    intl,
    history,
    onNavigateLeft,
    onNavigateRight,
}: Props) => {
    const matchResult = useMatch({ history, location: history.location }, ['/:activeTab/:deeplink/*', '/']);
    const { params } = matchResult || { params: {} };

    const hasLeftNavigation = collection.length > 1 && currentIndex > 0 && currentIndex < collection.length;
    const hasRightNavigation = collection.length > 1 && currentIndex > -1 && currentIndex < collection.length - 1;

    if (!hasLeftNavigation && !hasRightNavigation) {
        return null;
    }

    const goToActiveSidebarTab = (routeParams: Record<string, string>, navHistory: History) => {
        if (routeParams.deeplink) {
            if (routeParams.activeTab === SIDEBAR_VIEW_METADATA) {
                navHistory.push(`/${routeParams.activeTab}/${routeParams.deeplink}/${routeParams[0]}`);
            } else {
                navHistory.push(`/${routeParams.activeTab}`);
            }
        }
    };

    return (
        <>
            {hasLeftNavigation && (
                <PlainButton
                    className="bcpr-navigate-left"
                    onClick={() => {
                        goToActiveSidebarTab(params, history);
                        onNavigateLeft();
                    }}
                    title={intl.formatMessage(messages.previousFile)}
                    type={ButtonType.BUTTON}
                >
                    <IconNavigateLeft />
                </PlainButton>
            )}
            {hasRightNavigation && (
                <PlainButton
                    className="bcpr-navigate-right"
                    onClick={() => {
                        goToActiveSidebarTab(params, history);
                        onNavigateRight();
                    }}
                    title={intl.formatMessage(messages.nextFile)}
                    type={ButtonType.BUTTON}
                >
                    <IconNavigateRight />
                </PlainButton>
            )}
        </>
    );
};

export { PreviewNavigation as PreviewNavigationComponent };
export default injectIntl(PreviewNavigation);
