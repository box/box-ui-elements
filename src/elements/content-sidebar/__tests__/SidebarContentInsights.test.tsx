import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { render, fireEvent } from '@testing-library/react';

import SidebarContentInsights from '../SidebarContentInsights';

jest.unmock('react-intl');

describe('elements/content-sidebar/SidebarContentInsights', () => {
    const getWrapper = (props = {}) =>
        render(
            <SidebarContentInsights
                contentInsights={{ graphData: [], isLoading: true, previousPeriodCount: 0, totalCount: 0 }}
                onContentInsightsClick={jest.fn()}
                {...props}
            />,
            {
                wrapper: ({ children }: { children?: React.ReactNode }) => (
                    <IntlProvider locale="en-US">{children}</IntlProvider>
                ),
            },
        );

    describe('render()', () => {
        test('should render correctly', () => {
            const wrapper = getWrapper();

            expect(wrapper.getByText('Content Insights')).toBeVisible();
            expect(wrapper.queryByTestId('ContentAnalyticsErrorState-image')).toBe(null);
            expect(wrapper.container.querySelector('.ContentInsightsSummary--redesigned')).toBeNull();
        });

        test('should apply redesigned class when isRedesignEnabled', () => {
            const wrapper = getWrapper({ isRedesignEnabled: true });

            expect(wrapper.container.querySelector('.ContentInsightsSummary--redesigned')).toBeInTheDocument();
        });

        test('should call click handler when ContentInsightsSummary button is clicked', () => {
            const onContentInsightsClick = jest.fn();
            const wrapper = getWrapper({
                contentInsights: { graphData: [], isLoading: false, previousPeriodCount: 0, totalCount: 0 },
                onContentInsightsClick,
            });

            fireEvent.click(wrapper.getByText('See Details'));

            expect(onContentInsightsClick).toBeCalledTimes(1);
        });

        test('should render error state', () => {
            const contentInsights = { error: new Error() };
            const wrapper = getWrapper({ contentInsights });

            expect(wrapper.getByTestId('ContentAnalyticsErrorState-image')).toBeVisible();
        });
    });
});
