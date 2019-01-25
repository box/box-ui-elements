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

const BetaBadge = ({ className = '', ...rest }: Props) => {
    const classes = classNames('beta-badge', className);

    return (
        <Badge className={classes} type="warning" {...rest}>
            <FormattedMessage {...messages.beta} />
        </Badge>
    );
};

export default BetaBadge;
