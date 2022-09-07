// @flow
import * as React from 'react';
import { injectIntl, type InjectIntlProvidedProps } from 'react-intl';

import BarChart from './charts/bar/BarChart';
import messages from './messages';
import MetricSummary from './MetricSummary';
import { METRIC, PERIOD } from './constants';
import type { GraphData } from './types';

import './GraphCardPreviewsSummary.scss';

type Props = {
    graphData: GraphData,
    previousPeriodCount: number,
    totalCount: number,
} & InjectIntlProvidedProps;

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
