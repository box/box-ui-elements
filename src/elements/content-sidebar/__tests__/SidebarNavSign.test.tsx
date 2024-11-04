import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import SidebarNavSign from '../SidebarNavSign';
// @ts-ignore Module is written in Flow
import FeatureProvider from '../../common/feature-checking/FeatureProvider';
// @ts-ignore Module is written in Flow
import messages from '../messages';
// @ts-ignore Module is written in Flow
import localize from '../../../../test/support/i18n.js';

jest.unmock('react-intl');

describe('elements/content-sidebar/SidebarNavSign', () => {
    const onClickRequestSignature = jest.fn();
    const onClickSignMyself = jest.fn();
    const signLabel = localize(messages.boxSignRequestSignature.id);
    const requestSignatureButtonText = localize(messages.boxSignRequestSignature.id);
    const signMyselfButtonText = localize(messages.boxSignSignMyself.id);

    const renderComponent = (props = {}, features = {}) =>
        render(
            <FeatureProvider features={features}>
                <SidebarNavSign {...props} />
            </FeatureProvider>,
            {
                wrapper: ({ children }: { children?: React.ReactNode }) => (
                    <IntlProvider locale="en-US">{children}</IntlProvider>
                ),
            },
        );

    test('should render sign button', () => {
        const wrapper = renderComponent();

        expect(wrapper.getByLabelText(signLabel)).toBeVisible();
    });

    test('should open dropdown with 2 menu items when sign button is clicked', () => {
        const wrapper = renderComponent();

        fireEvent.click(wrapper.getByLabelText(signLabel));

        expect(wrapper.getByText(requestSignatureButtonText)).toBeVisible();
        expect(wrapper.getByText(signMyselfButtonText)).toBeVisible();
    });

    test('should call correct handler when request signature option is clicked', () => {
        const features = {
            boxSign: {
                onClick: onClickRequestSignature,
            },
        };
        const wrapper = renderComponent({}, features);

        fireEvent.click(wrapper.getByLabelText(signLabel));
        fireEvent.click(wrapper.getByText(requestSignatureButtonText));

        expect(onClickRequestSignature).toBeCalled();
    });

    test('should call correct handler when sign myself option is clicked', () => {
        const features = {
            boxSign: {
                onClickSignMyself,
            },
        };
        const wrapper = renderComponent({}, features);

        fireEvent.click(wrapper.getByLabelText(signLabel));
        fireEvent.click(wrapper.getByText(signMyselfButtonText));

        expect(onClickSignMyself).toBeCalled();
    });
});
