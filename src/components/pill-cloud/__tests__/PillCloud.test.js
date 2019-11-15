import React from 'react';

import PillCloud from '..';

describe('components/pill-cloud/PillCloud', () => {
    test('should render pills', () => {
        const pills = [
            { value: 1, displayText: 'Hello' },
            { value: 2, displayText: 'There' },
            { value: 3, displayText: 'Sir' },
        ];
        const wrapper = shallow(<PillCloud options={pills} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should create a button for each child', () => {
        const pills = [
            { value: 1, displayText: 'Hello' },
            { value: 2, displayText: 'There' },
            { value: 3, displayText: 'Sir' },
        ];
        const wrapper = shallow(<PillCloud options={pills} />);

        expect(wrapper.find('.bdl-PillCloud-button').length).toEqual(3);
    });

    test('should be able to handle 0 children', () => {
        const wrapper = shallow(<PillCloud options={[]} />);

        expect(wrapper.find('.bdl-PillCloud-button').length).toEqual(0);
    });

    test('should be able to handle 1 child', () => {
        const pills = [{ value: 1, displayText: 'Hello' }];
        const wrapper = shallow(<PillCloud options={pills} />);

        expect(wrapper.find('.bdl-PillCloud-button').length).toEqual(1);
    });

    test('should add selected class to a selected pill when passed by reference', () => {
        const pills = [
            { value: 1, displayText: 'Hello' },
            { value: 2, displayText: 'There' },
            { value: 3, displayText: 'Sir' },
        ];
        const wrapper = shallow(<PillCloud options={pills} selectedOptions={[pills[1]]} />);
        const buttons = wrapper.find('.bdl-PillCloud-button');
        expect(
            buttons
                .at(1)
                .props()
                .className.includes('is-selected'),
        ).toBeTruthy();
    });

    test('should add selected class to a selected pill when passed by value', () => {
        const pills = [
            { value: 1, displayText: 'Hello' },
            { value: 2, displayText: 'There' },
            { value: 3, displayText: 'Sir' },
        ];
        const wrapper = shallow(<PillCloud options={pills} selectedOptions={[{ value: 3, displayText: 'Sir' }]} />);
        const buttons = wrapper.find('.bdl-PillCloud-button');
        expect(
            buttons
                .at(2)
                .props()
                .className.includes('is-selected'),
        ).toBeTruthy();
    });

    test('should pass selected child through to onSelect', () => {
        const pills = [{ value: 1, displayText: 'Hello' }];
        const wrapper = shallow(
            <PillCloud
                onSelect={option => {
                    expect(option.displayText).toEqual('Hello');
                    expect(option.value).toEqual(1);
                }}
                options={pills}
            />,
        );

        wrapper.find('.bdl-PillCloud-button').simulate('click');
    });
});
