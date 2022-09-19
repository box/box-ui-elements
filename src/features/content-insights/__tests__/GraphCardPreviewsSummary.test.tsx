import * as React from 'react';

import { render, screen } from '@testing-library/react';

import GraphCardPreviewsSummary from '../GraphCardPreviewsSummary';
// @ts-ignore: No ts definition
import localize from '../../../../test/support/i18n';
import messages from '../messages';
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

describe('features/content-insights/GraphCardPreviewsSummary', () => {
    const getWrapper = (props = {}) =>
        render(<GraphCardPreviewsSummary graphData={mockData} previousPeriodCount={1} totalCount={10} {...props} />);

    describe('render()', () => {
        test('should render correctly', () => {
            getWrapper();

            expect(screen.getByLabelText(localize(messages.previewGraphLabel.id))).toBeVisible();
            expect(screen.getByText('2')).toBeVisible(); // current period count
            expect(screen.getByText('10')).toBeVisible(); // total count
            expect(screen.getByText('100%')).toBeVisible(); // trend
        });
    });
});
