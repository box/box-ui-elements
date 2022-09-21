import React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';

import ContentInsightsSummary from '../../features/content-insights/ContentInsightsSummary';
import { GraphData } from '../../features/content-insights/types';
// @ts-ignore Module is written in Flow
import messages from '../common/messages';
// @ts-ignore Module is written in Flow
import SidebarSection from './SidebarSection';
// @ts-ignore Module is written in Flow
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import withErrorHandling from './withErrorHandling';

interface ContentInsights {
    error?: Object;
    graphData: GraphData;
    isLoading: boolean;
    previousPeriodCount: number;
    totalCount: number;
}

interface Props {
    contentInsights?: ContentInsights;
    error?: Object;
    onContentInsightsClick?: () => void;
}

const defaultContentInsights = {
    graphData: [],
    isLoading: true,
    previousPeriodCount: 0,
    totalCount: 0,
};

const SidebarContentInsights = ({ contentInsights = defaultContentInsights, onContentInsightsClick = noop }: Props) => {
    const { graphData, isLoading, previousPeriodCount, totalCount } = contentInsights;

    return (
        <SidebarSection title={<FormattedMessage {...messages.sidebarContentInsights} />}>
            <ContentInsightsSummary
                graphData={graphData}
                isLoading={isLoading}
                onClick={onContentInsightsClick}
                previousPeriodCount={previousPeriodCount}
                totalCount={totalCount}
            />
        </SidebarSection>
    );
};

export default withErrorHandling(SidebarContentInsights);
