import React from 'react';
import sinon from 'sinon';

import Select from '..';

const sandbox = sinon.sandbox.create();

describe('components/select/Select', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render label', () => {
        const wrapper = shallow(<Select label="Album" name="select" />);
        const label = wrapper.find('Label');

        expect(label.length).toBe(1);
        expect(label.prop('text')).toEqual('Album');
        expect(label.prop('hideLabel')).toBe(false);
    });

    test('should not render divs in labels for accessibility', () => {
        const wrapper = shallow(<Select label="Album" name="select" />);
        expect(wrapper.find('Label').find('div').length).toBe(0);
    });

    test('should hide label when showLabel prop is false', () => {
        const wrapper = shallow(<Select label="Album" name="select" showLabel={false} />);

        expect(wrapper.find('Label').prop('hideLabel')).toBe(true);
    });

    test('should correctly render options in select', () => {
        const wrapper = shallow(
            <Select label="Album" name="select">
                <option>1</option>
                <option>2</option>
                <option>3</option>
            </Select>,
        );

        expect(wrapper.find('option').length).toEqual(3);
    });

    test('should correctly render label tooltip when specified', () => {
        const wrapper = shallow(<Select label="Album" labelTooltip="This is my album." name="select" />);

        expect(wrapper.find('Label').prop('tooltip')).toEqual('This is my album.');
    });

    test('should correctly render custom attributes in select when specified', () => {
        const wrapper = shallow(<Select data-attr="test" label="Album" name="select" />);

        expect(wrapper.find('select').prop('data-attr')).toEqual('test');
    });

    test('should call the onchange function when handler is specified', () => {
        const onChange = sinon.spy();
        const wrapper = shallow(<Select label="Album" name="select" onChange={onChange} />);

        wrapper.find('select').simulate('change');
        expect(onChange.calledOnce).toBe(true);
    });

    test('should render infoTooltip when specified', () => {
        const wrapper = shallow(
            <Select infoIconProps={{ title: 'hello' }} infoTooltip="hello!!!" label="Album" name="select" />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should show Tooltip when error exists', () => {
        const wrapper = shallow(<Select error="error" label="label" />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should not show Tooltip when no error exists', () => {
        const wrapper = shallow(<Select label="label" />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should show error outline if specified', () => {
        const wrapper = shallow(<Select label="label" showErrorOutline />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should not show error outline if not specified', () => {
        const wrapper = shallow(<Select label="label" />);

        expect(wrapper).toMatchSnapshot();
    });
});
