// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import isFinite from 'lodash/isFinite';
import isNaN from 'lodash/isNaN';

import HeaderWithCount from './HeaderWithCount';
import messages from './messages';
import TrendPill from './TrendPill';
import { formatCount } from './CompactCount';
import { METRIC } from './constants';

const METRIC_MAP = {
    [METRIC.PREVIEWS]: {
        getPeriodCount: (data: GraphData) => data.reduce((count, { previewsCount }) => count + previewsCount, 0),
        headerMessage: messages.previewGraphType,
    },
    [METRIC.DOWNLOADS]: {
        getPeriodCount: (data: GraphData) => data.reduce((count, { downloadsCount }) => count + downloadsCount, 0),
        headerMessage: messages.downloadGraphType,
    },
    [METRIC.USERS]: {
        getPeriodCount: (data: GraphData) => {
            const periodUsers = data.reduce((totalUsers, { users }) => new Set([...totalUsers, ...users]), new Set());
            return periodUsers.size;
        },
        headerMessage: messages.peopleTitle,
    },
};

// Limit the trend to a finite number (in case the previous period count was 0 and the calculated trend is Infinity)
const formatTrend = (calculatedTrend: number) => (!isFinite(calculatedTrend) ? 1 : calculatedTrend);

const MetricSummary = ({ data, intl, metric, period, previousPeriodCount, totalCount }) => {
    const { getPeriodCount, headerMessage } = METRIC_MAP[metric];
    const periodCount = getPeriodCount(data);
    const calculatedTrend = (periodCount - previousPeriodCount) / previousPeriodCount;
    const trend = isNaN(calculatedTrend) ? 0 : formatTrend(calculatedTrend);

    return (
        <div className="MetricSummary">
            <HeaderWithCount title={intl.formatMessage(headerMessage)} totalCount={totalCount} />
            <div className="MetricSummary-period">
                <span className="MetricSummary-period-count">{formatCount(periodCount, intl)}</span>
                <TrendPill period={period} trend={trend} />
            </div>
        </div>
    );
};

MetricSummary.propTypes = {
    data: PropTypes.array,
    intl: PropTypes.any,
    metric: PropTypes.string,
    period: PropTypes.string,
    previousPeriodCount: PropTypes.number,
    totalCount: PropTypes.number,
};

export { MetricSummary as MetricSummaryBase };
export default injectIntl(MetricSummary);
