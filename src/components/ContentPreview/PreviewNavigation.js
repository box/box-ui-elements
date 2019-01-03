/**
 * @flow
 * @file Preview Navigation
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import IconNavigateLeft from 'box-react-ui/lib/icons/general/IconNavigateLeft';
import IconNavigateRight from 'box-react-ui/lib/icons/general/IconNavigateRight';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import messages from '../messages';

type Props = {
    collection: Array<String | BoxItem>,
    currentIndex: number,
    intl: any,
    onNavigateLeft: Function,
    onNavigateRight: Function,
};

const PreviewNavigation = ({ collection = [], currentIndex, intl, onNavigateLeft, onNavigateRight }: Props) => {
    const hasLeftNavigation = collection.length > 1 && currentIndex > 0 && currentIndex < collection.length;
    const hasRightNavigation = collection.length > 1 && currentIndex > -1 && currentIndex < collection.length - 1;

    return (
        <React.Fragment>
            {hasLeftNavigation && (
                <PlainButton
                    className="bcpr-navigate-left"
                    onClick={onNavigateLeft}
                    title={intl.formatMessage(messages.previousFile)}
                    type="button"
                >
                    <IconNavigateLeft />
                </PlainButton>
            )}
            {hasRightNavigation && (
                <PlainButton
                    className="bcpr-navigate-right"
                    onClick={onNavigateRight}
                    title={intl.formatMessage(messages.nextFile)}
                    type="button"
                >
                    <IconNavigateRight />
                </PlainButton>
            )}
        </React.Fragment>
    );
};

export default injectIntl(PreviewNavigation);
