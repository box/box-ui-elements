import * as React from 'react';
import classNames from 'classnames';

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
    isRedesignEnabled?: boolean;
}

const ContentInsightsSummary = ({
    error,
    graphData,
    isLoading,
    previousPeriodCount,
    onClick,
    totalCount,
    isRedesignEnabled,
}: Props) => {
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
                    isRedesignEnabled={isRedesignEnabled}
                    previousPeriodCount={previousPeriodCount}
                    totalCount={totalCount}
                />
                <OpenContentInsightsButton onClick={onClick} isRedesignEnabled={isRedesignEnabled} />
            </>
        );
    };

    return (
        <div
            className={classNames('ContentInsightsSummary', {
                'ContentInsightsSummary--redesigned': isRedesignEnabled,
            })}
        >
            {renderContentAnalyticsSummary()}
        </div>
    );
};

export default ContentInsightsSummary;
