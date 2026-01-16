import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';

import ContentInsightsSummary from '../../features/content-insights/ContentInsightsSummary';
import { GraphData, ResponseError } from '../../features/content-insights/types';
// @ts-ignore Module is written in Flow
import messages from '../common/messages';
// @ts-ignore Module is written in Flow
import SidebarSection from './SidebarSection';
// @ts-ignore Module is written in Flow
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import withErrorHandling from './withErrorHandling'; // Above eslint rules disabled because typescript chokes on flow type import in withErrorHandling

import './SidebarContentInsights.scss';

export interface ContentInsights {
    error?: ResponseError;
    graphData: GraphData;
    isLoading: boolean;
    previousPeriodCount: number;
    totalCount: number;
}

export interface Props {
    contentInsights?: ContentInsights;
    onContentInsightsClick?: () => void;
    isRedesignEnabled?: boolean;
}

const defaultContentInsights = {
    graphData: [],
    isLoading: true,
    previousPeriodCount: 0,
    totalCount: 0,
};

const SidebarContentInsights = ({
    contentInsights = defaultContentInsights,
    onContentInsightsClick = noop,
    isRedesignEnabled,
}: Props) => {
    const { error, graphData, isLoading, previousPeriodCount, totalCount } = contentInsights;

    return (
        <SidebarSection
            className="bcs-SidebarContentInsights"
            title={<FormattedMessage {...messages.sidebarContentInsights} />}
        >
            <ContentInsightsSummary
                error={error}
                graphData={graphData}
                isLoading={isLoading}
                onClick={onContentInsightsClick}
                previousPeriodCount={previousPeriodCount}
                totalCount={totalCount}
                isRedesignEnabled={isRedesignEnabled}
            />
        </SidebarSection>
    );
};

export default withErrorHandling(SidebarContentInsights);
