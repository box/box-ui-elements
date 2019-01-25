// @flow

import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import PlainButton from 'components/plain-button';

import messages from './messages';

type Props = {
    className: string,
    /** the number of saved versions that exist for this item, should be 2 or more */
    versionCount: number,
    onClick?: Function,
};

const VersionHistoryLink = ({ className, versionCount, onClick, ...rest }: Props) => {
    const formattedMessageComponent = <FormattedMessage {...messages.savedVersions} values={{ versionCount }} />;

    // Only render it as a link if there is an onClick
    if (onClick) {
        return (
            <PlainButton onClick={onClick} className={classNames('lnk', className)} {...rest}>
                {formattedMessageComponent}
            </PlainButton>
        );
    }

    return <div className={className}>{formattedMessageComponent}</div>;
};

VersionHistoryLink.defaultProps = {
    className: '',
};

export default VersionHistoryLink;
