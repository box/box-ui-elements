import React from 'react';
import { shallow } from 'enzyme';
import Status from '../Status';

describe('elements/content-sidebar/Skills/Status', () => {
    const getWrapper = props => shallow(<Status {...props} />);

    test('should render default status', () => {
        const wrapper = getWrapper({ card: {} });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render default status with message', () => {
        const wrapper = getWrapper({ card: { status: { message: 'error' } } });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render file size error', () => {
        const wrapper = getWrapper({
            card: { status: { code: 'skills_invalid_file_size_error' } },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render file ext error', () => {
        const wrapper = getWrapper({
            card: { status: { code: 'skills_invalid_file_format_error' } },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render unkown error', () => {
        const wrapper = getWrapper({
            card: { status: { code: 'skills_unknown_error' } },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render pending status', () => {
        const wrapper = getWrapper({
            card: { status: { code: 'skills_pending_status' } },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render invoked status', () => {
        const wrapper = getWrapper({
            card: { status: { code: 'skills_invoked_status' } },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render invocations error', () => {
        const wrapper = getWrapper({
            card: { status: { code: 'skills_invocations_error' } },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render billing error', () => {
        const wrapper = getWrapper({
            card: { status: { code: 'skills_billing_error' } },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render external auth error', () => {
        const wrapper = getWrapper({
            card: { status: { code: 'skills_external_auth_error' } },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render file processing error', () => {
        const wrapper = getWrapper({
            card: { status: { code: 'skills_file_processing_error' } },
        });
        expect(wrapper).toMatchSnapshot();
    });
});
