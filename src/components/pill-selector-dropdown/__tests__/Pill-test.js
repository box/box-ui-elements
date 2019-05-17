import React from 'react';
import sinon from 'sinon';

import Pill from '../Pill';

const sandbox = sinon.sandbox.create();

describe('components/pill-selector-dropdown/Pill', () => {
    const onRemoveStub = sandbox.stub();

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should render default component', () => {
        const wrapper = shallow(<Pill onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('pill')).toBe(true);
        expect(wrapper.hasClass('is-selected')).toBe(false);
        expect(wrapper.childAt(0).text()).toEqual('box');
        expect(wrapper.childAt(1).hasClass('close-btn')).toBe(true);
        expect(wrapper.find('.close-btn').prop('onClick')).toEqual(onRemoveStub);
    });

    test('should have the selected class when isSelected is true', () => {
        const wrapper = shallow(<Pill isSelected onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('is-selected')).toBe(true);
    });

    test('should generate pill with invalid class when pill is not valid', () => {
        const wrapper = shallow(<Pill isValid={false} isSelected onRemove={onRemoveStub} text="box" />);
        expect(wrapper).toMatchSnapshot();
    });
});
