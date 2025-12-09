import * as React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { FormInput } from '..';
import { FormContext } from '../FormContext';

const sandbox = sinon.sandbox.create();

describe('components/form-elements/form/FormInput', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should register itself with the form when form is exposed on context', () => {
        const mockForm = {
            registerInput: sandbox.mock().withArgs('forminput'),
            unregisterInput: sandbox.mock().never(),
        };

        mount(
            <FormContext.Provider value={{ form: mockForm }}>
                <FormInput name="forminput" onValidityStateUpdate={sinon.stub()}>
                    <input />
                </FormInput>
            </FormContext.Provider>,
        );
    });

    test('should unregister itself with the form when form is exposed on context and component unmounts', () => {
        const mockForm = {
            registerInput: sandbox.mock().withArgs('input'),
            unregisterInput: sandbox.mock().withArgs('input'),
        };

        const component = mount(
            <FormContext.Provider value={{ form: mockForm }}>
                <FormInput label="label" name="input" onValidityStateUpdate={sinon.stub()} value="">
                    Children
                </FormInput>
            </FormContext.Provider>,
        );

        component.unmount();
    });
});
