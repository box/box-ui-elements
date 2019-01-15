import * as React from 'react';
import { mount } from 'enzyme';
import { withFeatureProvider } from '..';

describe('withFeatureProvider HOC', () => {
    test('wraps component with FeatureProvider', () => {
        const MyComponent = () => <div />;
        const featureProp = { foo: true };
        const otherProps = { bar: true, baz: false };
        const WrapperComponent = withFeatureProvider(MyComponent);
        const container = mount(<WrapperComponent features={featureProp} {...otherProps} />);
        expect(container).toMatchInlineSnapshot(`
<ForwardRef(withFeatureProvider(MyComponent))
  bar={true}
  baz={false}
  features={
    Object {
      "foo": true,
    }
  }
>
  <FeatureProvider
    features={
      Object {
        "foo": true,
      }
    }
  >
    <MyComponent
      bar={true}
      baz={false}
    >
      <div />
    </MyComponent>
  </FeatureProvider>
</ForwardRef(withFeatureProvider(MyComponent))>
`);
        expect(container.find('ForwardRef(withFeatureProvider(MyComponent))')).toHaveLength(1);
        expect(container.find('FeatureProvider').props().features).toEqual(featureProp);
        expect(container.find('MyComponent').props()).toEqual(otherProps);
    });
});
