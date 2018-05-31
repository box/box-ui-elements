import React from 'react';
import { shallow } from 'enzyme';
import Status from '../Status';

describe('components/ContentSidebar/Skills/Status', () => {
    const getWrapper = (props) => shallow(<Status {...props} />);

    test('should render default status', () => {
        const wrapper = getWrapper({ card: {} });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render default status with message', () => {
        const wrapper = getWrapper({ card: { status: { message: 'error' } } });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render file size error', () => {
        const wrapper = getWrapper({ card: { status: { code: 'skills_invalid_file_size_error' } } });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render file ext error', () => {
        const wrapper = getWrapper({ card: { status: { code: 'skills_invalid_file_format_error' } } });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render unkown error', () => {
        const wrapper = getWrapper({ card: { status: { code: 'skills_unknown_error' } } });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render pending status', () => {
        const wrapper = getWrapper({ card: { status: { code: 'skills_pending_status' } } });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render internal server error', () => {
        const wrapper = getWrapper({ card: { status: { code: 'skills_internal_server_error' } } });
        expect(wrapper).toMatchSnapshot();
    });
});
