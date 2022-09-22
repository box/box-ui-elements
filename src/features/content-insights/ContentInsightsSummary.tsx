import * as React from 'react';

import ContentAnalyticsErrorState from './ContentAnalyticsErrorState';
import ContentInsightsSummaryGhostState from './ContentInsightsSummaryGhostState';
import GraphCardPreviewsSummary from './GraphCardPreviewsSummary';
import OpenContentInsightsButton from './OpenContentInsightsButton';
import { GraphData, ResponseError } from './types';

import './ContentInsightsSummary.scss';

interface Props {
    graphData: GraphData;
    error?: ResponseError;
    isLoading: boolean;
    onClick: () => void;
    previousPeriodCount: number;
    totalCount: number;
}

const ContentInsightsSummary = ({ error, graphData, isLoading, previousPeriodCount, onClick, totalCount }: Props) => {
    const renderContentAnalyticsSummary = () => {
        if (error) {
            return <ContentAnalyticsErrorState error={error} />;
        }

        if (isLoading) {
            return <ContentInsightsSummaryGhostState />;
        }

        return (
            <>
                <GraphCardPreviewsSummary
                    graphData={graphData}
                    previousPeriodCount={previousPeriodCount}
                    totalCount={totalCount}
                />
                <OpenContentInsightsButton onClick={onClick} />
            </>
        );
    };

    return <div className="ContentInsightsSummary">{renderContentAnalyticsSummary()}</div>;
};

export default ContentInsightsSummary;
