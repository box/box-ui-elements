import React from 'react';
import { shallow } from 'enzyme';
import UploadStartState from '../UploadStartState';
import { bdlBoxBlue } from '../../../styles/variables';

describe('icons/states/UploadStartState', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<UploadStartState />);

        expect(wrapper.hasClass('upload-start-state')).toEqual(true);
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
                .prop('fill'),
        ).toEqual(bdlBoxBlue);
        expect(
            wrapper
                .find('path')
                .at(2)
                .prop('fill'),
        ).toEqual(bdlBoxBlue);
        expect(
            wrapper
                .find('path')
                .at(3)
                .prop('fill'),
        ).toEqual(bdlBoxBlue);
        expect(
            wrapper
                .find('path')
                .at(4)
                .prop('fill'),
        ).toEqual(bdlBoxBlue);
        expect(wrapper.find('circle').prop('fill')).toEqual(bdlBoxBlue);
        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(128);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(85);
    });

    test('should correctly render icon with specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<UploadStartState color={color} />);

        expect(
            wrapper
                .find('path')
                .at(0)
                .prop('fill'),
        ).toEqual(color);
        expect(
            wrapper
                .find('path')
                .at(1)
                .prop('fill'),
        ).toEqual(color);
        expect(
            wrapper
                .find('path')
                .at(2)
                .prop('fill'),
        ).toEqual(color);
        expect(
            wrapper
                .find('path')
                .at(3)
                .prop('fill'),
        ).toEqual(color);
        expect(
            wrapper
                .find('path')
                .at(4)
                .prop('fill'),
        ).toEqual(color);
        expect(wrapper.find('circle').prop('fill')).toEqual(color);
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<UploadStartState height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'fool';
        const wrapper = shallow(<UploadStartState title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
