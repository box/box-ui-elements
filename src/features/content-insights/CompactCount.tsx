import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import classNames from 'classnames';

import { formatCount } from './numberUtils';

interface Props {
    className?: string;
    count: number;
    intl: IntlShape;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

function CompactCount({ className, count, intl, ...rest }: Props) {
    return (
        <span className={classNames('CompactCount', className)} {...rest}>
            {formatCount(count, intl)}
        </span>
    );
}

export default injectIntl(CompactCount);
