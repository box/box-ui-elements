// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Badge from './Badge';
import messages from './messages';

type Props = {
    /** Additional class to the component */
    className?: string,
};

const UpgradeBadge = ({ className = '', ...rest }: Props) => {
    const classes = classNames('upgrade-badge', className);

    return (
        <Badge className={classes} {...rest}>
            <FormattedMessage {...messages.upgrade} />
        </Badge>
    );
};

export default UpgradeBadge;
