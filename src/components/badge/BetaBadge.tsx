import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Badge from './Badge';
import messages from './messages';
import { BadgeType, ExtendedBadgeProps as Props } from './types';

const BetaBadge = ({ className = '', ...rest }: Props) => {
    const classes = classNames('beta-badge', className);

    return (
        <Badge className={classes} type={BadgeType.WARNING} {...rest}>
            <FormattedMessage {...messages.beta} />
        </Badge>
    );
};

export default BetaBadge;
