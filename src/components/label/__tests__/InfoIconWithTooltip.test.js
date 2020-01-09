// @flow
import * as React from 'react';
import { shallow } from 'enzyme';

import InfoIconWithTooltip from '../InfoIconWithTooltip';

describe('components/label/InfoIconWithTooltip', () => {
    const defaultProps = {
        className: 'test-class',
        iconProps: { a: 'a', b: 'b', c: 'c' },
        tooltipText: 'I am a tooltip',
    };

    const getWrapper = props => shallow(<InfoIconWithTooltip {...defaultProps} {...props} />);

    test('should render correctly', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
