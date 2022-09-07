// @flow
import React from 'react';
import { injectIntl, type InjectIntlProvidedProps } from 'react-intl';
import classNames from 'classnames';

import numAbbr from '../../utils/numAbbr';

type Props = {
    className?: string,
    count: number,
    onMouseEnter?: () => void,
    onMouseLeave?: () => void,
} & InjectIntlProvidedProps;

export const formatCount = (count: number, intl: $PropertyType<InjectIntlProvidedProps, 'intl'>): string => {
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
