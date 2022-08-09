// @flow
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import LabelPill from '../../components/label-pill';
import messages from './messages';

import './TrendPill.scss';

const getTrendLabel = (intl, trend): string => {
    return intl.formatMessage(trend > 0 ? messages.trendUp : messages.trendDown);
};

const getTrendStatus = (trend): Trend => {
    if (trend === 0) {
        return 'neutral';
    }

    return trend > 0 ? 'up' : 'down';
};

const getTrendByPeriod = (period: Period) => {
    switch (period) {
        case 'month':
            return messages.trendMonth;
        case 'threemonths':
            return messages.trendThreeMonths;
        case 'year':
            return messages.trendYear;
        case 'week':
        default:
            return messages.trendWeek;
    }
};

const TrendPill = ({ intl, period, trend }) => {
    const trendStatus = getTrendStatus(trend);
    const trendLabel = getTrendLabel(intl, trend);

    return (
        <LabelPill.Pill
            className={classNames('TrendPill', {
                'TrendPill--up': trendStatus === 'up',
                'TrendPill--down': trendStatus === 'down',
            })}
        >
            {trendStatus !== 'neutral' && <span aria-label={trendLabel} className="TrendPill-trend" role="img" />}
            <LabelPill.Text>
                <span className="TrendPill-percentage">{intl.formatNumber(trend, { style: 'percent' })}</span>
                <FormattedMessage {...getTrendByPeriod(period)} />
            </LabelPill.Text>
        </LabelPill.Pill>
    );
};

TrendPill.propTypes = {
    intl: PropTypes.any,
    period: PropTypes.string,
    trend: PropTypes.number,
};

export { TrendPill as TrendPillBase };
export default injectIntl(TrendPill);
