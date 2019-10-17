import React from 'react';
import { shallow } from 'enzyme';
import CustomInstance from '../CustomInstance';

describe('CustomInstance', () => {
    describe('onAddFieldToggle()', () => {
        test('should toggle add field', () => {
            const component = shallow(<CustomInstance />);
            const instance = component.instance();

            instance.onAddFieldToggle();

            expect(component.state('isAddFieldVisible')).toEqual(true);
        });
    });
    describe('getDerivedStateFromProps()', () => {
        test('should merge data into the state properties', () => {
            const fakeData = {
                test: '123',
                file: '345',
            };

            const mockRespData = {
                test: '789',
                file: 'ABC',
            };

            const component = shallow(<CustomInstance data={fakeData} />);

            component.setProps({ data: mockRespData });

            expect(component.state('properties')).toEqual(mockRespData);
        });
    });
});
