// @flow

import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../components/plain-button';

import messages from './messages';

type Props = {
    className: string,
    /** the number of saved versions that exist for this item, should be 2 or more */
    onClick?: Function,
    versionCount: number,
};

const VersionHistoryLink = ({ className, versionCount, onClick, ...rest }: Props) => {
    const formattedMessageComponent = <FormattedMessage {...messages.savedVersions} values={{ versionCount }} />;

    // Only render it as a link if there is an onClick
    if (onClick) {
        return (
            <PlainButton className={classNames('lnk', className)} onClick={onClick} {...rest}>
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
