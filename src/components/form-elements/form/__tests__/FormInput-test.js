import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { FormInput } from '..';

const sandbox = sinon.sandbox.create();

describe('components/form-elements/form/FormInput', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should register itself with the form when form is exposed on context', () => {
        const context = {
            form: {
                registerInput: sandbox.mock().withArgs('forminput'),
                unregisterInput: sandbox.mock().never(),
            },
        };

        mount(
            <FormInput name="forminput" onValidityStateUpdate={sinon.stub()}>
                <input />
            </FormInput>,
            { context },
        );
    });

    test('should unregister itself with the form when form is exposed on context and component unmounts', () => {
        const context = {
            form: {
                registerInput: sandbox.mock().withArgs('input'),
                unregisterInput: sandbox.mock().withArgs('input'),
            },
        };

        const component = mount(
            <FormInput label="label" name="input" onValidityStateUpdate={sinon.stub()} value="">
                Children
            </FormInput>,
            { context },
        );

        component.unmount();
    });
});
