import React from 'react';

import makeLoadable from '../makeLoadable';

describe('components/loading-indicator/makeLoadable', () => {
    let TestComponent;

    beforeEach(() => {
        TestComponent = () => <div className="test-component">blah</div>;
    });

    test('should render BaseComponent when isLoading is false', () => {
        const LoadableComponent = makeLoadable(TestComponent);
        const wrapper = shallow(<LoadableComponent isLoading={false} />);

        expect(wrapper.find('TestComponent').length).toEqual(1);
        expect(wrapper.find('LoadingIndicator').length).toEqual(0);
    });

    test('should pass props down to BaseComponent', () => {
        const LoadableComponent = makeLoadable(TestComponent);
        const wrapper = shallow(<LoadableComponent className="foo" hello="123" isLoading={false} />);

        expect(wrapper.find('TestComponent').prop('hello')).toEqual('123');
        expect(wrapper.find('TestComponent').prop('className')).toEqual('foo');
    });

    test('should render LoadingIndicator when isLoading is true', () => {
        const LoadableComponent = makeLoadable(TestComponent);
        const wrapper = shallow(<LoadableComponent isLoading />);

        expect(wrapper.find('TestComponent').length).toEqual(0);
        expect(wrapper.find('LoadingIndicator').length).toEqual(1);
    });

    test('should pass loadingIndicatorPorps to LoadingIndicator', () => {
        const LoadableComponent = makeLoadable(TestComponent);
        const wrapper = shallow(<LoadableComponent isLoading loadingIndicatorProps={{ className: 'foobar' }} />);

        expect(wrapper.find('LoadingIndicator').prop('className')).toEqual('foobar');
    });
});
