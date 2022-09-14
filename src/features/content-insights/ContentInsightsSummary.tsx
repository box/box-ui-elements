import * as React from 'react';
import { AxiosError } from 'axios';

import ContentAnalyticsErrorState from './ContentAnalyticsErrorState';
import ContentInsightsSummaryGhostState from './ContentInsightsSummaryGhostState';
import GraphCardPreviewsSummary from './GraphCardPreviewsSummary';
import OpenContentInsightsButton from './OpenContentInsightsButton';
import { GraphData } from './types';

import './ContentInsightsSummary.scss';

interface Props {
    error: AxiosError | null;
    graphData: GraphData;
    isLoading: boolean;
    onClick: () => void;
    previousPeriodCount: number;
    totalCount: number;
}

const ContentInsightsSummary = ({ error, graphData, isLoading, previousPeriodCount, onClick, totalCount }: Props) => {
    const errorStatus = !!error && !!error.response ? error.response.status : null;

    const renderContentAnalyticsSummary = () => {
        if (!!errorStatus && errorStatus !== 403) {
            return <ContentAnalyticsErrorState />;
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
