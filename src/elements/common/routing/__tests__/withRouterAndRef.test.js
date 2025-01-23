// @flow
import * as React from 'react';
import { mount } from 'enzyme';
import CustomRouter from '../customRouter';
import withRouterAndRef from '../withRouterAndRef';

describe('elements/common/routing/withRouterAndRef', () => {
    /** @typedef {{ value: string }} Props */

    /** @type {React.ForwardRefRenderFunction<HTMLDivElement, Props>} */
    const TestComponent = React.forwardRef((props, ref) => <div ref={ref}>{props.value}</div>);
    const WithRouterComponent = withRouterAndRef(TestComponent);

    test('should pass ref down to wrapped component', () => {
        const ref = React.createRef();
        const wrapper = mount(
            <CustomRouter>
                <WithRouterComponent ref={ref} value="foo" />
            </CustomRouter>,
        );
        const referenced = wrapper.find('div').getDOMNode();
        expect(ref.current).toEqual(referenced);
        expect(referenced.innerHTML).toEqual('foo');
    });
});
