import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Badge from './Badge';
import messages from './messages';
import { ExtendedBadgeProps as Props } from './types';

const UpgradeBadge = ({ className = '', ...rest }: Props) => {
    const classes = classNames('upgrade-badge', className);

    return (
        <Badge className={classes} {...rest}>
            <FormattedMessage {...messages.upgrade} />
        </Badge>
    );
};

export default UpgradeBadge;
