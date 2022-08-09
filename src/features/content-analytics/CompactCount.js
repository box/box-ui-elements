// @flow
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import numAbbr from '../../utils/numAbbr';

const numAbbreviate = (intl: any, value: any, options: any): string => {
    return numAbbr(value, {
        ...options,
        locale: intl.locale,
        numbersData: intl.boxCldrData.numbers,
    });
};

export const formatCount = (count: number, intl: any): string => {
    const shouldAbbreviate = count >= 10000;
    // TODO: currently react-intl v2.9 doesn't support the `notation: compact` option. So when react-intl
    // gets upgraded, this code could be simplified with <FormattedNumber />
    return shouldAbbreviate ? numAbbreviate(intl, count) : intl.formatNumber(count);
};

const CompactCount = ({ className, count, intl, ...rest }) => (
    <span className={classNames('CompactCount', className)} {...rest}>
        {formatCount(count, intl)}
    </span>
);

CompactCount.propTypes = {
    className: PropTypes.string,
    count: PropTypes.number,
    intl: PropTypes.any,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
};

export { CompactCount as CompactCountBase };
export default injectIntl(CompactCount);
