// @flow
import React from 'react';
import { render, screen } from '@testing-library/react';

import ContentInsightsSummary from '../ContentInsightsSummary';
import localize from '../../../../test/support/i18n';
import messages from '../messages';

const mockData = [
    { start: 1, previewsCount: 0, type: 'day' },
    { start: 2, previewsCount: 0, type: 'day' },
    { start: 3, previewsCount: 0, type: 'day' },
    { start: 4, previewsCount: 0, type: 'day' },
    { start: 5, previewsCount: 0, type: 'day' },
    { start: 6, previewsCount: 1, type: 'day' },
    { start: 7, previewsCount: 1, type: 'day' },
];

describe('features/content-insights/ContentInsightsSummary', () => {
    const getWrapper = (props = {}) =>
        render(
            <ContentInsightsSummary
                graphData={mockData}
                isLoading={false}
                onCtaClick={jest.fn()}
                previousPeriodCount={1}
                totalCount={10}
                {...props}
            />,
        );

    describe('render', () => {
        test('should show the ghost state when isLoading is true', () => {
            getWrapper({ isLoading: true });

            expect(screen.getByTestId('GraphCardGhostState')).toBeVisible();
            expect(screen.queryByLabelText(localize(messages.previewGraphLabel.id))).toBeNull();
        });

        test('should render correctly when isLoading is false', () => {
            getWrapper();

            expect(screen.queryByTestId('GraphCardGhostState')).toBeNull();
            expect(screen.getByLabelText(localize(messages.previewGraphLabel.id))).toBeVisible();
        });

        test('should call the onCtaClick callback', () => {
            const onCtaClick = jest.fn();
            getWrapper({ onCtaClick });

            expect(onCtaClick).toBeCalledTimes(0);

            screen.getByRole('button').click();

            expect(onCtaClick).toBeCalledTimes(1);
        });
    });
});
