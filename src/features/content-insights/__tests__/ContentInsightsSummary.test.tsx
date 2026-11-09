import * as React from 'react';
import { render, screen } from '@testing-library/react';

import ContentInsightsSummary from '../ContentInsightsSummary';
import { GraphData } from '../types';

const mockData = [
    { start: 1, previewsCount: 0, type: 'day' },
    { start: 2, previewsCount: 0, type: 'day' },
    { start: 3, previewsCount: 0, type: 'day' },
    { start: 4, previewsCount: 0, type: 'day' },
    { start: 5, previewsCount: 0, type: 'day' },
    { start: 6, previewsCount: 1, type: 'day' },
    { start: 7, previewsCount: 1, type: 'day' },
] as GraphData;

const baseError = new Error('An error has occured');

describe('features/content-insights/ContentInsightsSummary', () => {
    const getWrapper = (props = {}) =>
        render(
            <ContentInsightsSummary
                graphData={mockData}
                error={undefined}
                isLoading={false}
                onClick={jest.fn()}
                previousPeriodCount={1}
                totalCount={10}
                {...props}
            />,
        );

    describe('render', () => {
        test('should show the ghost state when isLoading is true', () => {
            getWrapper({ isLoading: true });

            expect(screen.getByTestId('GraphCardGhostState')).toBeVisible();
            expect(
                screen.queryByLabelText('Chart displaying the number of previews over the selected time period'),
            ).toBeNull();
        });

        test('should render correctly when isLoading is false and error is null', () => {
            getWrapper();

            expect(screen.queryByTestId('ContentAnalyticsErrorState')).toBeNull();
            expect(screen.queryByTestId('GraphCardGhostState')).toBeNull();
            expect(
                screen.getByLabelText('Chart displaying the number of previews over the selected time period'),
            ).toBeVisible();
        });

        test('should show the error state when error exists', () => {
            getWrapper({ error: baseError });

            expect(screen.getByTestId('ContentAnalyticsErrorState-text')).toBeVisible();
            expect(screen.queryByTestId('ContentAnalyticsErrorState-text--permission')).not.toBeInTheDocument();
            expect(screen.queryByTestId('GraphCardGhostState')).toBeNull();
            expect(
                screen.queryByLabelText('Chart displaying the number of previews over the selected time period'),
            ).toBeNull();
        });

        test('should show the permission error state when error exists and is a permission error', () => {
            getWrapper({ error: { ...baseError, status: 403 } });

            expect(screen.getByTestId('ContentAnalyticsErrorState-text--permission')).toBeVisible();
            expect(screen.queryByTestId('ContentAnalyticsErrorState-text')).not.toBeInTheDocument();
            expect(screen.queryByTestId('GraphCardGhostState')).toBeNull();
            expect(
                screen.queryByLabelText('Chart displaying the number of previews over the selected time period'),
            ).toBeNull();
        });

        test('should call the onClick callback', () => {
            const onClick = jest.fn();
            getWrapper({ onClick });

            expect(onClick).toBeCalledTimes(0);

            screen.getByRole('button').click();

            expect(onClick).toBeCalledTimes(1);
        });
    });
});
