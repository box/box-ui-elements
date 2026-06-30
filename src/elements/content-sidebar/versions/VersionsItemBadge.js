/**
 * @flow
 * @file Versions Item Badge component
 * @author Box
 */
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { useFeatureEnabled } from '../../common/feature-checking';
import messages from './messages';
import './VersionsItemBadge.scss';

type Props = {
    intl: any,
    isCurrent?: boolean,
    versionNumber?: string,
};

const VersionsItemBadge = ({ intl, isCurrent, versionNumber }: Props) => {
    const intlValues = { versionNumber };
    const isLowercase = useFeatureEnabled('versions.versionNumberBadge.lowercase.enabled');

    return (
        <div
            aria-label={intl.formatMessage(messages.versionNumberLabel, intlValues)}
            className={classNames('bcs-VersionsItemBadge', {
                'bcs-VersionsItemBadge--current': isCurrent,
            })}
        >
            <FormattedMessage
                {...(isLowercase ? messages.versionNumberBadgeLowercase : messages.versionNumberBadge)}
                values={intlValues}
            />
        </div>
    );
};

export default injectIntl(VersionsItemBadge);
