import * as React from 'react';
import { mount } from 'enzyme';
import { isFeatureEnabled, FeatureProvider, FeatureFlag } from '..';

describe('isFeatureEnabled', () => {
    test('returns feature object if key is truthy', () => {
        const features = {
            isEnabled: {
                someProperty: 'sdafas',
            },
            isDisabled: false,
        };
        expect(isFeatureEnabled(features, 'isEnabled')).toBe(true);
        expect(isFeatureEnabled(features, 'isDisabled')).toBe(false);
    });
    test('defaults to false', () => {
        const features = {};
        expect(isFeatureEnabled(features, 'unknownKey')).toBe(false);
    });
});

describe('FeatureFlag', () => {
    test('renders children if target feature is enabled', () => {
        const MockChild = jest.fn(({ children }) => children);
        const foo = true;
        const wrapper = mount(
            <FeatureProvider
                features={{
                    foo,
                }}
            >
                <div>
                    <FeatureFlag feature="foo">
                        <MockChild>Foo</MockChild>
                    </FeatureFlag>
                </div>
            </FeatureProvider>,
        );
        expect(wrapper.html()).toMatchInlineSnapshot(`"<div>Foo</div>"`);
        expect(MockChild).toHaveBeenCalled();
    });

    test('does not render children if target feature is disabled', () => {
        const MockChild = jest.fn(({ children }) => children);
        const bar = false;
        const wrapper = mount(
            <FeatureProvider
                features={{
                    bar,
                }}
            >
                <FeatureFlag feature="bar">
                    <MockChild>Bar</MockChild>
                </FeatureFlag>
            </FeatureProvider>,
        );
        expect(wrapper.html()).toBeNull();
        expect(MockChild).not.toHaveBeenCalled();
    });
    test('calls enabled/disabled props', () => {
        const enabledFn = jest.fn(() => null);
        const disabledFn = jest.fn(() => null);
        const foo = { otherProp: 'foo' };
        const bar = false;
        mount(
            <FeatureProvider
                features={{
                    foo,
                    bar,
                }}
            >
                <FeatureFlag feature="foo" enabled={enabledFn} disabled={disabledFn} />
                <FeatureFlag feature="bar" enabled={enabledFn} disabled={disabledFn} />
            </FeatureProvider>,
        );
        expect(enabledFn).toHaveBeenCalledWith(foo);
        expect(disabledFn).toHaveBeenCalled();
    });
    test('uses children prop instead of enabled prop if both are provided', () => {
        const MockChild = jest.fn(() => null);
        const enabledFn = jest.fn(() => null);
        const foo = { otherProp: 'foo is enabled' };
        mount(
            <FeatureProvider
                features={{
                    foo,
                }}
            >
                <FeatureFlag feature="foo" enabled={enabledFn}>
                    <MockChild />
                </FeatureFlag>
            </FeatureProvider>,
        );
        expect(MockChild).toHaveBeenCalled();
        expect(enabledFn).not.toHaveBeenCalled();
    });
    test('defaults to rendering nothing', () => {
        const foo = undefined;
        const bar = { enabled: true };
        const features = { foo, bar };
        const containerWithinProvider = mount(
            <div>
                <FeatureProvider features={features}>
                    <FeatureFlag feature="foo" />
                    <FeatureFlag feature="bar" />
                </FeatureProvider>
            </div>,
        );
        expect(containerWithinProvider.html()).toMatchInlineSnapshot(`"<div></div>"`);

        const containerWithoutFeatureConfig = mount(
            <div>
                <FeatureProvider>
                    <FeatureFlag feature="foo" />
                    <FeatureFlag feature="bar" />
                </FeatureProvider>
            </div>,
        );
        expect(containerWithoutFeatureConfig.html()).toMatchInlineSnapshot(`"<div></div>"`);

        const containerWithoutProvider = mount(
            <div>
                <FeatureFlag feature="foo" />
                <FeatureFlag feature="bar" />
            </div>,
        );
        expect(containerWithoutProvider.html()).toMatchInlineSnapshot(`"<div></div>"`);
    });
});
