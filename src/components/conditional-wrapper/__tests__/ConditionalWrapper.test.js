import React from 'react';
import { shallow } from 'enzyme';

import ConditionalWrapper from '../ConditionalWrapper';

describe('components/in-app-messenger/core/components/ConditionalWrapper', () => {
    describe.each([[true], [false], [undefined]])('%o', isDisabled => {
        test('renders correctly', () => {
            const props = {
                isDisabled,
                wrapper: 'div',
                otherProps: 'other-props',
            };

            const wrapper = shallow(
                <ConditionalWrapper {...props}>
                    <div />
                </ConditionalWrapper>,
            );

            expect(wrapper).toMatchSnapshot();
        });
    });
});
