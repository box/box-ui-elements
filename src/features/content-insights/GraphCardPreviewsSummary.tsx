import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';

import BarChart from './charts/bar/BarChart';
import messages from './messages';
import MetricSummary from './MetricSummary';
import { METRIC, PERIOD } from './constants';
import { GraphData } from './types';

import './GraphCardPreviewsSummary.scss';

interface Props {
    graphData: GraphData;
    intl: IntlShape;
    previousPeriodCount: number;
    totalCount: number;
}

function GraphCardPreviewsSummary({ graphData, intl, previousPeriodCount, totalCount }: Props) {
    return (
        <>
            <MetricSummary
                data={graphData}
                metric={METRIC.PREVIEWS}
                period={PERIOD.WEEK}
                previousPeriodCount={previousPeriodCount}
                totalCount={totalCount}
            />
            <BarChart
                className="GraphCardPreviewsSummary-chart"
                data={graphData}
                label={intl.formatMessage(messages.previewGraphLabel)}
                labelAccessor="start"
                valueAccessor="previewsCount"
            />
        </>
    );
}

export default injectIntl(GraphCardPreviewsSummary);
