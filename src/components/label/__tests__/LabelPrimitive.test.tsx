import React from 'react';
import { shallow } from 'enzyme';
import LabelPrimitive from '../LabelPrimitive';

const labelContent = ['My Label'];

describe('components/label/LabelPrimitive', () => {
    test('should correctly render default element', () => {
        const wrapper = shallow(
            <LabelPrimitive labelContent={labelContent}>
                <input type="text" />
            </LabelPrimitive>,
        );

        expect(wrapper.find('label').length).toEqual(1);
        expect(wrapper.find('span.label').length).toEqual(1);
        expect(wrapper.find('.label').prop('children')).toEqual(labelContent);
        expect(wrapper.find('input').length).toEqual(1);
        expect(wrapper.find('.label-optional').length).toEqual(0);
    });

    test('should set the passed classNames', () => {
        const className = 'this is a test';

        const wrapper = shallow(
            <LabelPrimitive className={className} labelContent={labelContent}>
                <input type="text" />
            </LabelPrimitive>,
        );

        expect(wrapper.find('.label').prop('className')).toEqual('label bdl-Label this is a test');
    });

    test('should fire passed mouse enter handler', () => {
        let firedCount = 0;

        const rest = {
            onMouseEnter: () => {
                firedCount += 1;
            },
        };

        const wrapper = shallow(
            <LabelPrimitive labelContent={labelContent} {...rest}>
                <input type="text" />
            </LabelPrimitive>,
        );

        const label = wrapper.find('.label');
        label.simulate('mouseEnter');

        expect(firedCount).toEqual(1);
    });

    test('should fire passed mouse leave handler', () => {
        let firedCount = 0;

        const rest = {
            onMouseLeave: () => {
                firedCount += 1;
            },
        };

        const wrapper = shallow(
            <LabelPrimitive labelContent={labelContent} {...rest}>
                <input type="text" />
            </LabelPrimitive>,
        );

        const label = wrapper.find('.label');
        label.simulate('mouseLeave');

        expect(firedCount).toEqual(1);
    });
});
