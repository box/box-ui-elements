/**
 * @flow
 * @file Versions Item Badge component
 * @author Box
 */
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from './messages';
import './VersionsItemBadge.scss';

type Props = {
    intl: any,
    versionNumber: string,
};

const VersionsItemBadge = ({ intl, versionNumber }: Props) => {
    const intlValues = { versionNumber };

    return (
        <div aria-label={intl.formatMessage(messages.versionNumberLabel, intlValues)} className="bcs-VersionsItemBadge">
            <FormattedMessage {...messages.versionNumberBadge} values={intlValues} />
        </div>
    );
};

export default injectIntl(VersionsItemBadge);
