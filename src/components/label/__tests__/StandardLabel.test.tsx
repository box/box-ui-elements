import React from 'react';
import { shallow } from 'enzyme';
import StandardLabel from '../StandardLabel';

const labelContent = ['My Label'];
const tooltipText = 'This is my tooltip';

describe('components/label/StandardLabel', () => {
    test('should correctly render default element', () => {
        const wrapper = shallow(
            <StandardLabel labelContent={labelContent}>
                <input type="text" />
            </StandardLabel>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render text tooltip when specified', () => {
        const wrapper = shallow(
            <StandardLabel labelContent={labelContent} tooltip={tooltipText}>
                <input type="text" />
            </StandardLabel>,
        );

        expect(wrapper.find('Tooltip').length).toBe(1);
        expect(wrapper.find('Tooltip').prop('text')).toEqual(tooltipText);
    });

    test('should not render tooltip when no tooltip specified', () => {
        const wrapper = shallow(
            <StandardLabel labelContent={labelContent}>
                <input type="text" />
            </StandardLabel>,
        );

        expect(wrapper.find('Tooltip').length).toBe(0);
    });
});
