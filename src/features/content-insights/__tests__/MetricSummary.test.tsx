import React from 'react';
import { render, screen } from '@testing-library/react';
// @ts-ignore: No ts definition
import localize from '../../../../test/support/i18n';

import messages from '../messages';
import MetricSummary from '../MetricSummary';
import { METRIC, PERIOD } from '../constants';
import { GraphData } from '../types';

const mockPreviewData = [
    { start: 1, previewsCount: 0 },
    { start: 2, previewsCount: 0 },
    { start: 3, previewsCount: 0 },
    { start: 4, previewsCount: 0 },
    { start: 5, previewsCount: 0 },
    { start: 6, previewsCount: 1 },
    { start: 7, previewsCount: 1 },
] as GraphData;

const mockDownloadData = [
    { start: 1, downloadsCount: 0 },
    { start: 2, downloadsCount: 0 },
    { start: 3, downloadsCount: 0 },
    { start: 4, downloadsCount: 0 },
    { start: 5, downloadsCount: 0 },
    { start: 6, downloadsCount: 1 },
    { start: 7, downloadsCount: 1 },
] as GraphData;

const mockUserData = ([
    { start: 1, users: [] },
    { start: 2, users: [] },
    { start: 3, users: [] },
    { start: 4, users: [] },
    { start: 5, users: [] },
    { start: 6, users: [1, 2] },
    { start: 7, users: [] },
] as unknown) as GraphData;

describe('features/content-insights/MetricSummary', () => {
    const downloadHeaderMessage = localize(messages.downloadGraphType.id);
    const peopleHeaderMessage = localize(messages.peopleTitle.id);
    const previewHeaderMessage = localize(messages.previewGraphType.id);

    const getWrapper = (props = {}) => {
        return render(
            <MetricSummary
                data={mockPreviewData}
                metric={METRIC.PREVIEWS}
                period={PERIOD.WEEK}
                previousPeriodCount={10}
                totalCount={20}
                {...props}
            />,
        );
    };

    describe('render', () => {
        test('should render correctly', () => {
            getWrapper();

            expect(screen.getByText(previewHeaderMessage)).toBeVisible();
        });

        test.each`
            metric              | data                | header                   | period
            ${METRIC.PREVIEWS}  | ${mockPreviewData}  | ${previewHeaderMessage}  | ${PERIOD.WEEK}
            ${METRIC.DOWNLOADS} | ${mockDownloadData} | ${downloadHeaderMessage} | ${PERIOD.WEEK}
            ${METRIC.USERS}     | ${mockUserData}     | ${peopleHeaderMessage}   | ${PERIOD.WEEK}
            ${METRIC.PREVIEWS}  | ${mockPreviewData}  | ${previewHeaderMessage}  | ${PERIOD.MONTH}
            ${METRIC.DOWNLOADS} | ${mockDownloadData} | ${downloadHeaderMessage} | ${PERIOD.MONTH}
            ${METRIC.USERS}     | ${mockUserData}     | ${peopleHeaderMessage}   | ${PERIOD.MONTH}
            ${METRIC.PREVIEWS}  | ${mockPreviewData}  | ${previewHeaderMessage}  | ${PERIOD.THREEMONTHS}
            ${METRIC.DOWNLOADS} | ${mockDownloadData} | ${downloadHeaderMessage} | ${PERIOD.THREEMONTHS}
            ${METRIC.USERS}     | ${mockUserData}     | ${peopleHeaderMessage}   | ${PERIOD.THREEMONTHS}
            ${METRIC.PREVIEWS}  | ${mockPreviewData}  | ${previewHeaderMessage}  | ${PERIOD.YEAR}
            ${METRIC.DOWNLOADS} | ${mockDownloadData} | ${downloadHeaderMessage} | ${PERIOD.YEAR}
            ${METRIC.USERS}     | ${mockUserData}     | ${peopleHeaderMessage}   | ${PERIOD.YEAR}
        `('should render correct metric summary for $metric', ({ data, header, metric, period }) => {
            getWrapper({ metric, data, period });

            expect(screen.getByText(header)).toBeVisible();
            expect(screen.getByText('20')).toBeVisible();
            expect(screen.getByText('-80%')).toBeVisible();
        });
    });
});
