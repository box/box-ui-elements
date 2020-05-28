// @flow
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import withRouterAndRef from '../withRouterAndRef';

describe('elements/common/routing/withRouterAndRef', () => {
    type Props = {
        value: string,
    };

    const TestComponent = React.forwardRef(({ value }: Props, ref) => <div ref={ref}>{value}</div>);
    const WithRouterComponent = withRouterAndRef(TestComponent);

    test('should pass ref down to wrapped component', () => {
        const ref = React.createRef();
        const wrapper = mount(
            <MemoryRouter>
                <WithRouterComponent ref={ref} value="foo" />
            </MemoryRouter>,
        );
        const referenced = wrapper.find('div').getDOMNode();
        expect(ref.current).toEqual(referenced);
        expect(referenced.innerHTML).toEqual('foo');
    });
});
