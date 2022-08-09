// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import BarChart from './charts/bar/BarChart';
import Button from '../../components/button';
import MetricSummary from './MetricSummary';
import messages from './messages';

import './ContentAnalytics.scss';

const ContentAnalytics = ({ graphData, onClick, intl, metric, period, previewCount, relevantActivity }) => (
    <>
        <MetricSummary
            data={graphData}
            metric={metric}
            period={period}
            previousPeriodCount={relevantActivity.length}
            totalCount={previewCount}
        />
        <BarChart
            className="ContentAnalytics-chart"
            data={graphData}
            label={intl.formatMessage(messages.previewGraphLabel)}
            labelAccessor="start"
            valueAccessor="previewsCount"
        />
        <Button className="ContentAnalytics-button" onClick={onClick} type="button">
            <FormattedMessage {...messages.openContentAnalyticsButton} />
        </Button>
    </>
);

ContentAnalytics.propTypes = {
    graphData: PropTypes.array,
    intl: PropTypes.any,
    metric: PropTypes.string,
    onClick: PropTypes.func,
    period: PropTypes.string,
    previewCount: PropTypes.number,
    relevantActivity: PropTypes.array,
};

export { ContentAnalytics as ContentAnalyticsBase };
export default injectIntl(ContentAnalytics);
