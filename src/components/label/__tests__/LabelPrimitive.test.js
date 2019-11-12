import React from 'react';

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
        expect(wrapper.find('span.bdl-Label').length).toEqual(1);
        expect(wrapper.find('.bdl-Label').prop('children')).toEqual(labelContent);
        expect(wrapper.find('input').length).toEqual(1);
        expect(wrapper.find('.bdl-label-optional').length).toEqual(0);
    });

    test('should set the passed classNames', () => {
        const className = 'this is a test';

        const wrapper = shallow(
            <LabelPrimitive className={className} labelContent={labelContent}>
                <input type="text" />
            </LabelPrimitive>,
        );

        expect(wrapper.find('.bdl-Label').prop('className')).toEqual('bdl-Label this is a test');
    });

    test('should fire passed mouse enter handler', () => {
        let firedCount = 0;

        function onMouseEnter() {
            firedCount += 1;
        }

        const wrapper = shallow(
            <LabelPrimitive labelContent={labelContent} onMouseEnter={onMouseEnter}>
                <input type="text" />
            </LabelPrimitive>,
        );

        const label = wrapper.find('.bdl-Label');
        label.simulate('mouseEnter');

        expect(firedCount).toEqual(1);
    });

    test('should fire passed mouse leave handler', () => {
        let firedCount = 0;

        function onMouseLeave() {
            firedCount += 1;
        }

        const wrapper = shallow(
            <LabelPrimitive labelContent={labelContent} onMouseLeave={onMouseLeave}>
                <input type="text" />
            </LabelPrimitive>,
        );

        const label = wrapper.find('.bdl-Label');
        label.simulate('mouseLeave');

        expect(firedCount).toEqual(1);
    });
});
