import React from 'react';
import { shallow } from 'enzyme';
import ExecuteForm from '../ExecuteForm';

describe('elements/content-open-with/ExecuteForm', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const executePostData = {
        url: 'foo.com',
        params: [
            { key: 'foo', value: 'bar' },
            { key: 'bar', value: 'baz' },
        ],
    };

    const submitStub = jest.fn();
    const ref = {
        current: {
            submit: submitStub,
        },
    };
    const onSubmitStub = jest.fn();

    const getWrapper = props => shallow(<ExecuteForm {...props} />);

    describe('componentDidMount', () => {
        it('should submit the form and call callback on mount', () => {
            React.createRef = jest.fn().mockReturnValue(ref);
            const wrapper = getWrapper({
                executePostData,
                onSubmit: onSubmitStub,
            });
            const instance = wrapper.instance();

            instance.componentDidMount();
            expect(submitStub).toBeCalled();
            expect(onSubmitStub).toBeCalled();
        });
    });

    it('should render an input for each param', () => {
        const wrapper = getWrapper({
            executePostData,
            onSubmit: onSubmitStub,
        });

        const instance = wrapper.instance();
        instance.ref = ref;

        expect(wrapper).toMatchSnapshot();
    });
});
