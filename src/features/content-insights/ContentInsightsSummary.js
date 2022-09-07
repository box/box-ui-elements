// @flow
import * as React from 'react';

import ContentInsightsSummaryGhostState from './ContentInsightsSummaryGhostState';
import GraphCardPreviewsSummary from './GraphCardPreviewsSummary';
import OpenContentInsightsButton from './OpenContentInsightsButton';
import type { GraphData } from './types';

import './ContentInsightsSummary.scss';

type Props = {
    graphData: GraphData,
    isLoading: boolean,
    onCtaClick: () => void,
    previousPeriodCount: number,
    totalCount: number,
};

export default function ContentInsightsSummary({
    graphData,
    isLoading,
    previousPeriodCount,
    onCtaClick,
    totalCount,
}: Props) {
    return (
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
                    <OpenContentInsightsButton onClick={onCtaClick} />
                </>
            )}
        </div>
    );
}
