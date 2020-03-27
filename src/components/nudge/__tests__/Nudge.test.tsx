import React from 'react';
import { shallow } from 'enzyme';

import RelayPlanet140 from '../../../illustration/RelayPlanet140';
import Nudge, { NudgeProps } from '../Nudge';

const defaultProps = {
    buttonText: <span>Pellentesque in port</span>,
    content: <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis rutrum turpis.</p>,
    illustration: <RelayPlanet140 height={170} width={170} />,
    isShown: true,
    header: <h3>Heading goes here</h3>,
    onButtonClick: jest.fn(),
    onCloseButtonClick: jest.fn(),
};

const getWrapper = (props?: NudgeProps) => shallow(<Nudge {...defaultProps} {...props} />);

describe('components/nudge/Nudge', () => {
    test('should correctly render Nudge', () => {
        const wrapper = getWrapper();

        expect(wrapper.hasClass('bdl-Nudge')).toBe(true);
        expect(wrapper).toMatchSnapshot();
    });
});
