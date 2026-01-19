import * as React from 'react';
import { IntlProvider } from 'react-intl';
import noop from 'lodash/noop';

import ContentInsightsSummary from '../../ContentInsightsSummary';
import { GraphData } from '../../types';

const mockGraphData: GraphData = [
    { start: 1, end: 2, previewsCount: 150, downloadsCount: 50, users: new Set(['user1']), type: 'day' },
    { start: 2, end: 3, previewsCount: 200, downloadsCount: 60, users: new Set(['user1', 'user2']), type: 'day' },
    { start: 3, end: 4, previewsCount: 180, downloadsCount: 45, users: new Set(['user2']), type: 'day' },
    { start: 4, end: 5, previewsCount: 220, downloadsCount: 70, users: new Set(['user1', 'user3']), type: 'day' },
    { start: 5, end: 6, previewsCount: 190, downloadsCount: 55, users: new Set(['user2', 'user3']), type: 'day' },
    { start: 6, end: 7, previewsCount: 250, downloadsCount: 80, users: new Set(['user1', 'user2']), type: 'day' },
    { start: 7, end: 8, previewsCount: 210, downloadsCount: 65, users: new Set(['user3']), type: 'day' },
];

const defaultProps: React.ComponentProps<typeof ContentInsightsSummary> = {
    graphData: mockGraphData,
    error: undefined,
    isLoading: false,
    onClick: noop,
    previousPeriodCount: 800,
    totalCount: 1217,
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider locale="en">
        <div style={{ width: 300, padding: 20, backgroundColor: '#fff' }}>{children}</div>
    </IntlProvider>
);

export const Default = {
    render: () => (
        <Wrapper>
            <ContentInsightsSummary {...defaultProps} />
        </Wrapper>
    ),
};

export const WithRedesignEnabled = {
    render: () => (
        <Wrapper>
            <ContentInsightsSummary {...defaultProps} isRedesignEnabled />
        </Wrapper>
    ),
};

export const Loading = {
    render: () => (
        <Wrapper>
            <ContentInsightsSummary {...defaultProps} isLoading />
        </Wrapper>
    ),
};

export const LoadingWithRedesign = {
    render: () => (
        <Wrapper>
            <ContentInsightsSummary {...defaultProps} isLoading isRedesignEnabled />
        </Wrapper>
    ),
};

export const WithError = {
    render: () => (
        <Wrapper>
            <ContentInsightsSummary
                {...defaultProps}
                error={Object.assign(new Error('An error occurred'), { status: 500 })}
            />
        </Wrapper>
    ),
};

export const WithPositiveTrend = {
    render: () => (
        <Wrapper>
            <ContentInsightsSummary {...defaultProps} previousPeriodCount={500} />
        </Wrapper>
    ),
};

export const WithPositiveTrendRedesign = {
    render: () => (
        <Wrapper>
            <ContentInsightsSummary {...defaultProps} previousPeriodCount={500} isRedesignEnabled />
        </Wrapper>
    ),
};

export const WithNegativeTrend = {
    render: () => (
        <Wrapper>
            <ContentInsightsSummary {...defaultProps} previousPeriodCount={2000} />
        </Wrapper>
    ),
};

export const WithNegativeTrendRedesign = {
    render: () => (
        <Wrapper>
            <ContentInsightsSummary {...defaultProps} previousPeriodCount={2000} isRedesignEnabled />
        </Wrapper>
    ),
};

export default {
    title: 'Features/ContentInsights/tests/visual-regression-tests',
    component: ContentInsightsSummary as React.ComponentType,
};
