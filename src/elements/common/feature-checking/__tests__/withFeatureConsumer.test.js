import * as React from 'react';
import { mount } from 'enzyme';
import { withFeatureConsumer, FeatureProvider } from '..';

describe('withFeatureConsumer HOC', () => {
    test('wraps component with FeatureConsumer', () => {
        const MyComponent = () => <div />;
        const featureProp = { myFeature: true };
        const WrappedComponent = withFeatureConsumer(MyComponent);
        const container = mount(
            <FeatureProvider features={featureProp}>
                <WrappedComponent />
            </FeatureProvider>,
        );
        expect(container.find('MyComponent').props().features).toEqual(featureProp);
    });
});
