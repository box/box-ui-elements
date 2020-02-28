import * as React from 'react';
import { shallow } from 'enzyme';
import SandboxesEmptyState from '../SandboxesEmptyState';

describe('icons/states/SandboxesEmptyState', () => {
    test('should correctly render default icon with default colors', () => {
        const wrapper = shallow(<SandboxesEmptyState />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const wrapper = shallow(<SandboxesEmptyState primaryColor="#fcfcfc" secondaryColor="#eee" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height and default viewBox value', () => {
        const wrapper = shallow(<SandboxesEmptyState height={131} width={200} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const wrapper = shallow(<SandboxesEmptyState title="abcde" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with custom class name', () => {
        const wrapper = shallow(<SandboxesEmptyState className="empty" />);
        expect(wrapper).toMatchSnapshot();
    });
});
