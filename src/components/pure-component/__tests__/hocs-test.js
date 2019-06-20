import React from 'react';
import { shallow } from 'enzyme';

import pure from '../hocs';

describe('components/core/pure-component/hocs', () => {
    describe('pure()', () => {
        test('should render a functional stateless component', () => {
            const Component = pure(({ className }) => <div className={className} />);
            const wrapper = shallow(<Component className="test" />);
            expect(wrapper.is('div')).toBe(true);
            expect(wrapper.hasClass('test')).toBe(true);
        });

        test('should set name to function name', () => {
            // eslint-disable-next-line react/prop-types
            function TestComponent({ className }) {
                return <div className={className} />;
            }

            const Component = pure(TestComponent);

            expect(Component.displayName).toEqual('TestComponent');
        });
    });
});
