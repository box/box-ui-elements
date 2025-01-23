import * as React from 'react';
import { render, fireEvent } from '../../../test-utils/testing-library';
import SidebarNavSign from '../SidebarNavSign';
// @ts-ignore Module is written in Flow
import FeatureProvider from '../../common/feature-checking/FeatureProvider';

describe('elements/content-sidebar/SidebarNavSign', () => {
    const onClickRequestSignature = jest.fn();
    const onClickSignMyself = jest.fn();

    const renderComponent = (props = {}, features = {}) =>
        render(
            <FeatureProvider features={features}>
                <SidebarNavSign {...props} />
            </FeatureProvider>,
        );

    test.each([true, false])('should render sign button', isRemoveInterstitialEnabled => {
        const features = {
            boxSign: {
                isSignRemoveInterstitialEnabled: isRemoveInterstitialEnabled,
            },
        };

        const wrapper = renderComponent({}, features);
        expect(wrapper.getByTestId('sign-button')).toBeVisible();
    });

    test('should call correct handler when sign button is clicked', () => {
        const features = {
            boxSign: {
                isSignRemoveInterstitialEnabled: false,
                onClick: onClickRequestSignature,
            },
        };
        const { getByTestId } = renderComponent({}, features);

        fireEvent.click(getByTestId('sign-button'));

        expect(onClickRequestSignature).toBeCalled();
    });

    test('should open dropdown with 2 menu items when sign button is clicked', () => {
        const features = {
            boxSign: {
                isSignRemoveInterstitialEnabled: true,
            },
        };
        const { getByTestId } = renderComponent({}, features);
        fireEvent.click(getByTestId('sign-button'));
        expect(getByTestId('sign-request-signature-button')).toBeVisible();
        expect(getByTestId('sign-sign-myself-button')).toBeVisible();
    });

    test('should call correct handler when request signature option is clicked', () => {
        const features = {
            boxSign: {
                isSignRemoveInterstitialEnabled: true,
                onClick: onClickRequestSignature,
            },
        };
        const { getByTestId } = renderComponent({}, features);
        fireEvent.click(getByTestId('sign-button'));
        fireEvent.click(getByTestId('sign-request-signature-button'));
        expect(onClickRequestSignature).toBeCalled();
    });

    test('should call correct handler when sign myself option is clicked', () => {
        const features = {
            boxSign: {
                isSignRemoveInterstitialEnabled: true,
                onClickSignMyself,
            },
        };
        const { getByTestId } = renderComponent({}, features);
        fireEvent.click(getByTestId('sign-button'));
        fireEvent.click(getByTestId('sign-sign-myself-button'));
        expect(onClickSignMyself).toBeCalled();
    });
});
