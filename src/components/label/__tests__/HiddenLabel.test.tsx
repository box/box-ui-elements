import React from 'react';
import { shallow } from 'enzyme';
import HiddenLabel from '../HiddenLabel';

const labelContent = ['My Label'];
const expectedClassName = 'accessibility-hidden';

describe('components/label/HiddenLabel', () => {
    test('should correctly render default element', () => {
        const wrapper = shallow(
            <HiddenLabel labelContent={labelContent}>
                <input type="text" />
            </HiddenLabel>,
        );

        expect(wrapper.find('LabelPrimitive').length).toEqual(1);
        expect(wrapper.find('LabelPrimitive').prop('labelContent')).toEqual(labelContent);
    });

    test('should set the className on LabelPrimitive that hides the label text', () => {
        const wrapper = shallow(
            <HiddenLabel labelContent={labelContent}>
                <input type="text" />
            </HiddenLabel>,
        );

        expect(wrapper.find('LabelPrimitive').prop('className')).toEqual(expectedClassName);
    });
});
