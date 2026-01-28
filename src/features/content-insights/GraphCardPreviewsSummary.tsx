import * as React from 'react';
import classNames from 'classnames';
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
    isRedesignEnabled?: boolean;
    previousPeriodCount: number;
    totalCount: number;
}

function GraphCardPreviewsSummary({ graphData, intl, isRedesignEnabled, previousPeriodCount, totalCount }: Props) {
    return (
        <>
            <MetricSummary
                data={graphData}
                isRedesignEnabled={isRedesignEnabled}
                metric={METRIC.PREVIEWS}
                period={PERIOD.WEEK}
                previousPeriodCount={previousPeriodCount}
                totalCount={totalCount}
            />
            <BarChart
                className={classNames('GraphCardPreviewsSummary-chart', {
                    'GraphCardPreviewsSummary-chart--redesigned': isRedesignEnabled,
                })}
                data={graphData}
                label={intl.formatMessage(messages.previewGraphLabel)}
                labelAccessor="start"
                valueAccessor="previewsCount"
            />
        </>
    );
}

export default injectIntl(GraphCardPreviewsSummary);
