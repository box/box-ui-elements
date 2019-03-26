/**
 * @flow
 * @file Versions Item Badge component
 * @author Box
 */
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { intlShape } from 'react-intl';
import messages from './messages';
import './VersionsItemBadge.scss';

type Props = {
    intl: intlShape,
    isDisabled: boolean,
    versionNumber: string,
};

const VersionsItemBadge = ({ intl, isDisabled, versionNumber }: Props) => {
    const className = classNames('bcs-VersionsItemBadge', {
        'bcs-is-disabled': isDisabled,
    });
    const intlValues = { versionNumber };

    return (
        <div aria-label={intl.formatMessage(messages.versionNumberLabel, intlValues)} className={className}>
            <FormattedMessage {...messages.versionNumberBadge} values={intlValues} />
        </div>
    );
};

export default injectIntl(VersionsItemBadge);
