import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { render, fireEvent } from '../../../test-utils/testing-library';

import contentInsightsMessages from '../../../features/content-insights/messages';
// @ts-ignore Module is written in Flow
import localize from '../../../../test/support/i18n';
// @ts-ignore Module is written in Flow
import messages from '../../common/messages';
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

            expect(wrapper.getByText(localize(messages.sidebarContentInsights.id))).toBeVisible();
            expect(wrapper.queryByTestId('ContentAnalyticsErrorState-image')).toBe(null);
        });

        test('should call click handler when ContentInsightsSummary button is clicked', () => {
            const onContentInsightsClick = jest.fn();
            const wrapper = getWrapper({
                contentInsights: { graphData: [], isLoading: false, previousPeriodCount: 0, totalCount: 0 },
                onContentInsightsClick,
            });

            fireEvent.click(wrapper.getByText(localize(contentInsightsMessages.openContentInsightsButton.id)));

            expect(onContentInsightsClick).toBeCalledTimes(1);
        });

        test('should render error state', () => {
            const contentInsights = { error: new Error() };
            const wrapper = getWrapper({ contentInsights });

            expect(wrapper.getByTestId('ContentAnalyticsErrorState-image')).toBeVisible();
        });
    });
});
