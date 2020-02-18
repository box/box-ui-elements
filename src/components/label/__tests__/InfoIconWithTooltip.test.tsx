import * as React from 'react';
import { shallow } from 'enzyme';

import InfoIconWithTooltip from '../InfoIconWithTooltip';

describe('components/label/InfoIconWithTooltip', () => {
    const defaultProps = {
        className: 'test-class',
        iconProps: { a: 'a', b: 'b', c: 'c' },
        tooltipText: 'I am a tooltip',
    };

    test('should render correctly', () => {
        const wrapper = shallow(<InfoIconWithTooltip {...defaultProps} />);
        expect(wrapper).toMatchSnapshot();
    });
});
