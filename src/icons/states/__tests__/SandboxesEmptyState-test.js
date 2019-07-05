import * as React from 'react';

import SandboxesEmptyState from '../SandboxesEmptyState';
import { bdlBoxBlue, bdlBoxBlue40 } from '../../../styles/variables';

describe('icons/states/SandboxesEmptyState', () => {
    test('should correctly render default icon with default colors', () => {
        const wrapper = shallow(<SandboxesEmptyState />);

        expect(wrapper.hasClass('bdl-SandboxesEmptyState')).toEqual(true);
        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual(bdlBoxBlue);
        expect(
            wrapper
                .find('path')
                .at(1)
                .prop('stroke'),
        ).toEqual(bdlBoxBlue40);
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(130);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(85);
        expect(wrapper.find('AccessibleSVG').prop('viewBox')).toEqual('0 0 130 85');
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const primaryColor = '#fcfcfc';
        const secondaryColor = '#eeeeee';
        const wrapper = shallow(<SandboxesEmptyState primaryColor={primaryColor} secondaryColor={secondaryColor} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual(secondaryColor);
        expect(
            wrapper
                .find('path')
                .at(1)
                .prop('stroke'),
        ).toEqual(primaryColor);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height and default viewBox value', () => {
        const width = 200;
        const height = 131;
        const wrapper = shallow(<SandboxesEmptyState height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
        expect(wrapper.find('AccessibleSVG').prop('viewBox')).toEqual('0 0 130 85');
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const title = 'abcde';
        const wrapper = shallow(<SandboxesEmptyState title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
        expect(wrapper).toMatchSnapshot();
    });
});
