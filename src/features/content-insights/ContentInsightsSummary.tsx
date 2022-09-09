import * as React from 'react';

import ContentInsightsSummaryGhostState from './ContentInsightsSummaryGhostState';
import GraphCardPreviewsSummary from './GraphCardPreviewsSummary';
import OpenContentInsightsButton from './OpenContentInsightsButton';
import { GraphData } from './types';

import './ContentInsightsSummary.scss';

interface Props {
    graphData: GraphData;
    isLoading: boolean;
    onClick: () => void;
    previousPeriodCount: number;
    totalCount: number;
}

const ContentInsightsSummary = ({ graphData, isLoading, previousPeriodCount, onClick, totalCount }: Props) => (
    <div className="ContentInsightsSummary">
        {isLoading ? (
            <ContentInsightsSummaryGhostState />
        ) : (
            <>
                <GraphCardPreviewsSummary
                    graphData={graphData}
                    previousPeriodCount={previousPeriodCount}
                    totalCount={totalCount}
                />
                <OpenContentInsightsButton onClick={onClick} />
            </>
        )}
    </div>
);

export default ContentInsightsSummary;
