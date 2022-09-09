import * as React from 'react';
import isFinite from 'lodash/isFinite';
import isNaN from 'lodash/isNaN';
import { injectIntl, IntlShape } from 'react-intl';

import HeaderWithCount from './HeaderWithCount';
import messages from './messages';
import TrendPill from './TrendPill';
import { formatCount } from './numberUtils';
import { METRIC } from './constants';
import { GraphData, Metric, Period } from './types';

import './MetricSummary.scss';

interface Props {
    data: GraphData;
    intl: IntlShape;
    metric: Metric;
    period: Period;
    previousPeriodCount: number;
    totalCount?: number;
}

const METRIC_MAP = {
    [METRIC.PREVIEWS]: {
        headerMessage: messages.previewGraphType,
        getPeriodCount: (data: GraphData) => data.reduce((count, { previewsCount }) => count + previewsCount, 0),
    },
    [METRIC.DOWNLOADS]: {
        getPeriodCount: (data: GraphData) => data.reduce((count, { downloadsCount }) => count + downloadsCount, 0),
        headerMessage: messages.downloadGraphType,
    },
    [METRIC.USERS]: {
        getPeriodCount: (data: GraphData) => {
            const periodUsers = data.reduce(
                (totalUsers, { users }) => new Set([...Array.from(totalUsers), ...Array.from(users)]),
                new Set(),
            );
            return periodUsers.size;
        },
        headerMessage: messages.peopleTitle,
    },
} as const;

// Limit the trend to a finite number (in case the previous period count was 0 and the calculated trend is Infinity)
const formatTrend = (calculatedTrend: number) => (!isFinite(calculatedTrend) ? 1 : calculatedTrend);

function MetricSummary({ data = [], intl, metric, period, previousPeriodCount = 0, totalCount }: Props) {
    const { getPeriodCount, headerMessage } = METRIC_MAP[metric];
    const periodCount = getPeriodCount(data);
    const calculatedTrend = (periodCount - previousPeriodCount) / previousPeriodCount;
    const trend = isNaN(calculatedTrend) ? 0 : formatTrend(calculatedTrend);

    return (
        <div className="MetricSummary">
            <HeaderWithCount title={intl.formatMessage(headerMessage)} totalCount={totalCount} />
            <div className="MetricSummary-period">
                <span className="MetricSummary-periodCount">{formatCount(periodCount, intl)}</span>
                <TrendPill period={period} trend={trend} />
            </div>
        </div>
    );
}

export default injectIntl(MetricSummary);
