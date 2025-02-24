import * as React from 'react';
import { render, screen } from '@testing-library/react';
import AdditionalTabTooltip from '../AdditionalTabTooltip';

describe('elements/content-sidebar/additional-tabs/AdditionalTabTooltip', () => {
    const getComponent = (
        props: Partial<{
            defaultTooltipText: React.ReactNode;
            ftuxTooltipData?: { targetingApi: () => { canShow: boolean }; text: string };
            isFtuxVisible?: boolean;
        }>,
        children?: React.ReactNode,
    ) =>
        render(
            <AdditionalTabTooltip defaultTooltipText="" {...props}>
                {children}
            </AdditionalTabTooltip>,
        );

    test('should render the FTUX tooltip when isFtuxVisible is true and the FTUX can be shown', () => {
        const children = <div data-testid="additional-tab-tooltip-children">Child content</div>;
        const targetingApi = () => ({
            canShow: true,
        });
        const text = 'FTUX Text';

        getComponent({ isFtuxVisible: true, ftuxTooltipData: { targetingApi, text } }, children);

        expect(screen.getByTestId('additional-tab-tooltip-children')).toBeInTheDocument();
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    test('should render the children with the default tooltip when isFtuxVisible is false', () => {
        const children = <div data-testid="additional-tab-tooltip-children">Child content</div>;

        getComponent({ isFtuxVisible: false }, children);

        expect(screen.getByTestId('additional-tab-tooltip-children')).toBeInTheDocument();
        expect(screen.queryByText('FTUX Text')).not.toBeInTheDocument();
    });

    test('should render the children with the default tooltip when canShow is false', () => {
        const children = <div data-testid="additional-tab-tooltip-children">Child content</div>;
        const targetingApi = () => ({
            canShow: false,
        });
        const text = 'FTUX Text';

        getComponent({ isFtuxVisible: true, ftuxTooltipData: { targetingApi, text } }, children);

        expect(screen.getByTestId('additional-tab-tooltip-children')).toBeInTheDocument();
        expect(screen.queryByText(text)).not.toBeInTheDocument();
    });
});
