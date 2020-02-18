import React from 'react';
import { shallow, mount } from 'enzyme';

import InfoIconWithTooltip from '../InfoIconWithTooltip';
import Label from '../Label';

const text = 'My Label';

describe('components/label/Label', () => {
    const defaultProps = {
        children: <input type="text" />,
        text: 'My Label',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMountedWrapper = (props: any) => mount(<Label {...defaultProps} {...props} />);

    test('should correctly render default element', () => {
        const wrapper = shallow(
            <Label text={text}>
                <input type="text" />
            </Label>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should render the hidden label when hideLabel is set', () => {
        const wrapper = shallow(
            <Label hideLabel text={text}>
                <input type="text" />
            </Label>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render optional text when specified', () => {
        const wrapper = mount(
            <Label showOptionalText text={text}>
                <input type="text" />
            </Label>,
        );

        expect(wrapper.find('.label-optional').length).toEqual(1);

        // Make sure text 'optional' appears in parentheses like '(optional)'
        expect(/.*\(.*\).*/.test(wrapper.find('.label-optional').html())).toEqual(true);
    });

    describe('with infoToolTip', () => {
        test('should get the given iconProps', () => {
            const infoIconProps = { a: 'a', b: 'b' };
            const wrapper = getMountedWrapper({
                infoTooltip: 'Test tooltip',
                infoIconProps,
            });
            expect(wrapper.find(InfoIconWithTooltip).prop('iconProps')).toEqual(expect.objectContaining(infoIconProps));
        });

        test('should get the tooltip text', () => {
            const wrapper = getMountedWrapper({ infoTooltip: 'Test tooltip' });
            expect(wrapper.find(InfoIconWithTooltip).prop('tooltipText')).toEqual('Test tooltip');
        });
    });
});
