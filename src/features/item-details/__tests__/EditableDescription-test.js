import React from 'react';

import { EditableDescriptionBase as EditableDescription } from '../EditableDescription';

describe('features/item-details/EditableDescription', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <EditableDescription intl={{ formatMessage: () => 'message' }} onDescriptionChange={() => {}} {...props} />,
        );

    test('should render default component', () => {
        const wrapper = getWrapper({
            textAreaProps: {
                'data-resin-target': 'description',
            },
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should set default value and additional props when specified', () => {
        const wrapper = getWrapper({
            textAreaProps: {
                minLength: 25,
            },
            value: 'description',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('handleBlur should call the description change handler', () => {
        const onDescriptionChange = jest.fn();
        const wrapper = getWrapper({
            value: 'description',
            onDescriptionChange,
        });

        wrapper.setState({ value: 'new description' });
        wrapper.instance().handleBlur();
        expect(onDescriptionChange).toHaveBeenCalledWith('new description');
    });

    test('handleChange should set the state', () => {
        const wrapper = getWrapper({
            value: 'new description',
        });

        const mockEvent = {
            currentTarget: {
                value: 'new description',
            },
        };

        wrapper.instance().handleChange(mockEvent);
        expect(wrapper.state().value).toEqual('new description');
    });

    test('should update the state when a new description prop is passed in', () => {
        const onDescriptionChange = jest.fn();
        const wrapper = getWrapper({
            value: 'description',
            onDescriptionChange,
        });

        wrapper.setProps({ value: 'new description' });
        expect(wrapper.state().value).toEqual('new description');
    });
});
