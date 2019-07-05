import * as React from 'react';

import SandboxesInterstitialState from '../SandboxesInterstitialState';
import { bdlBoxBlue, bdlBoxBlue10 } from '../../../styles/variables';

describe('icons/states/SandboxesInterstitialState', () => {
    test('should correctly render default icon with default colors', () => {
        const dimension = 140;
        const wrapper = shallow(<SandboxesInterstitialState />);
        const paths = wrapper.find('path');
        const colorMap = {
            0: ['fill', bdlBoxBlue10],
            1: ['fill', bdlBoxBlue10],
            2: ['fill', bdlBoxBlue],
            6: ['fill', bdlBoxBlue],
            9: ['fill', bdlBoxBlue10],
        };

        expect(wrapper.hasClass('bdl-SandboxesInterstitialState')).toEqual(true);
        expect(wrapper.find('ellipse').prop('stroke')).toEqual(bdlBoxBlue);
        expect(paths).toHaveLength(13);
        paths.forEach((node, index) => {
            const mappedProperty = colorMap[index];
            if (mappedProperty) {
                expect(node.prop(mappedProperty[0])).toEqual(mappedProperty[1]);
            } else {
                expect(node.prop('stroke')).toEqual(bdlBoxBlue);
            }
        });
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('viewBox')).toEqual('0 0 140 140');
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const primaryColor = '#fcfcfc';
        const secondaryColor = '#eeeeee';
        const wrapper = shallow(
            <SandboxesInterstitialState primaryColor={primaryColor} secondaryColor={secondaryColor} />,
        );
        const paths = wrapper.find('path');
        const colorMap = {
            0: ['fill', secondaryColor],
            1: ['fill', secondaryColor],
            2: ['fill', primaryColor],
            6: ['fill', primaryColor],
            9: ['fill', secondaryColor],
        };

        expect(wrapper.find('ellipse').prop('stroke')).toEqual(primaryColor);
        paths.forEach((node, index) => {
            const mappedProperty = colorMap[index];
            if (mappedProperty) {
                expect(node.prop(mappedProperty[0])).toEqual(mappedProperty[1]);
            } else {
                expect(node.prop('stroke')).toEqual(primaryColor);
            }
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height and default viewBox value', () => {
        const dimension = 200;
        const wrapper = shallow(<SandboxesInterstitialState dimension={dimension} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(dimension);
        expect(wrapper.find('AccessibleSVG').prop('viewBox')).toEqual('0 0 140 140');
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const title = 'abcde';
        const wrapper = shallow(<SandboxesInterstitialState title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
        expect(wrapper).toMatchSnapshot();
    });
});
