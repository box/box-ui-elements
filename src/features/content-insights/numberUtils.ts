import { IntlShape } from 'react-intl';
import numAbbr from '../../utils/numAbbr';

const formatCount = (count: number, intl: IntlShape): string | string[] => {
    const shouldAbbreviate = count >= 10000;
    // TODO: currently react-intl v2.9 doesn't support the `notation: compact` option. So when react-intl
    // gets upgraded, this code could be simplified with <FormattedNumber />
    return shouldAbbreviate ? numAbbr(count, { locale: intl.locale }) : intl.formatNumber(count);
};

// eslint-disable-next-line import/prefer-default-export
export { formatCount };
