import * as React from 'react';
import { mount } from 'enzyme';
import { isFeatureEnabled, FeatureProvider, FeatureFlag } from '../features';

describe('isFeatureEnabled', () => {
    test('returns value of `enabled` property in feature options', () => {
        const features = {
            myFeature: {
                enabled: false,
            },
            otherFeature: {
                someProperty: 'sdafas',
                enabled: true,
            },
        };
        expect(isFeatureEnabled(features, 'otherFeature')).toBe(true);
        expect(isFeatureEnabled(features, 'myFeature')).toBe(false);
        expect(isFeatureEnabled(features, 'somethingElse')).toBe(false);
    });
    test('defaults to false', () => {
        const features = {};
        expect(isFeatureEnabled(features, 'somethingElse')).toBe(false);
    });
});

describe('FeatureFlag', () => {
    test('calls child function with target feature', () => {
        const childFn = jest.fn(() => null);
        const foo = { enabled: true, otherProp: 'foo is enabled' };
        mount(
            <FeatureProvider
                features={{
                    foo,
                }}
            >
                <FeatureFlag feature="foo">{childFn}</FeatureFlag>
            </FeatureProvider>,
        );
        expect(childFn).toHaveBeenCalledWith(true, foo);
    });
    test('calls enabled/disabled props', () => {
        const enabledFn = jest.fn(() => null);
        const disabledFn = jest.fn(() => null);
        const foo = { enabled: true, otherProp: 'foo' };
        const bar = { enabled: false, otherProp: 'bar' };
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
        expect(disabledFn).toHaveBeenCalledWith(bar);
    });
    test('calls children prop instead of enabled prop if both are provided', () => {
        const childFn = jest.fn(() => null);
        const enabledFn = jest.fn(() => null);
        const foo = { enabled: true, otherProp: 'foo is enabled' };
        mount(
            <FeatureProvider
                features={{
                    foo,
                }}
            >
                <FeatureFlag feature="foo" enabled={enabledFn}>
                    {childFn}
                </FeatureFlag>
            </FeatureProvider>,
        );
        expect(childFn).toHaveBeenCalled();
        expect(enabledFn).not.toHaveBeenCalled();
    });
    test('defaults to returning nothing', () => {
        const foo = { enabled: false };
        const bar = { enabled: true };
        const containerWithinProvider = mount(
            <div>
                <FeatureProvider
                    features={{
                        foo,
                        bar,
                    }}
                >
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
