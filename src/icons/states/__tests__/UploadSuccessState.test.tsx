import React from 'react';
import { shallow } from 'enzyme';
import UploadSuccessState from '../UploadSuccessState';
import { bdlBoxBlue } from '../../../styles/variables';

describe('icons/states/UploadSuccesstState', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<UploadSuccessState />);

        expect(wrapper.hasClass('upload-success-state')).toEqual(true);
        expect(
            wrapper
                .find('rect')
                .at(0)
                .prop('fill'),
        ).toEqual(bdlBoxBlue);
        expect(
            wrapper
                .find('rect')
                .at(1)
                .prop('fill'),
        ).toEqual(bdlBoxBlue);
        expect(
            wrapper
                .find('rect')
                .at(2)
                .prop('fill'),
        ).toEqual(bdlBoxBlue);
        expect(wrapper.find('path').prop('fill')).toEqual(bdlBoxBlue);
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(50);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(49);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<UploadSuccessState color={color} />);

        expect(
            wrapper
                .find('rect')
                .at(0)
                .prop('fill'),
        ).toEqual(color);
        expect(
            wrapper
                .find('rect')
                .at(1)
                .prop('fill'),
        ).toEqual(color);
        expect(
            wrapper
                .find('rect')
                .at(2)
                .prop('fill'),
        ).toEqual(color);
        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<UploadSuccessState height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<UploadSuccessState title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
