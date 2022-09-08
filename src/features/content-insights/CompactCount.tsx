import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import classNames from 'classnames';

import numAbbr from '../../utils/numAbbr';

interface Props {
    className?: string;
    count: number;
    intl: IntlShape;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const formatCount = (count: number, intl: IntlShape): string | string[] => {
    const shouldAbbreviate = count >= 10000;
    // TODO: currently react-intl v2.9 doesn't support the `notation: compact` option. So when react-intl
    // gets upgraded, this code could be simplified with <FormattedNumber />
    return shouldAbbreviate ? numAbbr(count, { locale: intl.locale }) : intl.formatNumber(count);
};

function CompactCount({ className, count, intl, ...rest }: Props) {
    return (
        <span className={classNames('CompactCount', className)} {...rest}>
            {formatCount(count, intl)}
        </span>
    );
}

export default injectIntl(CompactCount);
