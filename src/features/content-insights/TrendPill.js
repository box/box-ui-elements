// @flow
import React from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, type InjectIntlProvidedProps } from 'react-intl';

import LabelPill from '../../components/label-pill';
import messages from './messages';

import type { Period } from './types';

import './TrendPill.scss';

type Props = {
    period: Period,
    trend: number,
} & InjectIntlProvidedProps;

type Trend = 'up' | 'down' | 'neutral';

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

function TrendPill({ intl, period, trend }: Props) {
    const getTrendLabel = (value): string => {
        return intl.formatMessage(value > 0 ? messages.trendUp : messages.trendDown);
    };

    const trendStatus = getTrendStatus(trend);
    const trendLabel = getTrendLabel(trend);

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
}

export default injectIntl(TrendPill);
