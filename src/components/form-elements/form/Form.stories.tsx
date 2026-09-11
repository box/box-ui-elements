/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

import Button, { ButtonType } from '../../button/Button';
import Select from '../../select/Select';
import TextArea from '../text-area/TextArea';
import TextInput from '../text-input/TextInput';
import Toggle from '../../toggle/Toggle';

import Form, { FormSerializedData, FormValidityStateMap } from './Form';
import notes from './Form.stories.md';

export const basic = () => {
    const [formData, setFormData] = React.useState<FormSerializedData>({
        showtextareatoggle: '',
    });
    const [formValidityState, setFormValidityState] = React.useState<FormValidityStateMap>({});

    const customValidationFunc = (value: string) => {
        if (value !== 'box') {
            return {
                code: 'notbox',
                message: 'value is not box',
            };
        }
        return null;
    };

    return (
        <Form
            onChange={_formData => {
                setFormValidityState({});
                setFormData(_formData);
            }}
            onValidSubmit={() => {
                // On a server validation error, set formValidityState to
                // push error states to child inputs

                setFormValidityState({
                    username: {
                        code: 'usernametaken',
                        message: 'Username already taken.',
                    },
                });
            }}
            /* eslint-disable-next-line no-console */
            onInvalidSubmit={_formValidityState => console.log(_formValidityState)}
            formValidityState={formValidityState}
        >
            <div>
                <TextInput name="username" label="Username" placeholder="swagmaster6" type="text" isRequired />
            </div>
            <div>
                <TextInput name="email" label="Email Address" placeholder="user@example.com" type="email" />
            </div>
            <div>
                <TextInput
                    label="Must say box"
                    name="customValidationFunc"
                    placeholder="Not box"
                    type="text"
                    validation={customValidationFunc}
                />
            </div>

            <Select name="albumselect" label="Album">
                <option value={1}>Illmatic</option>
                <option value={2}>The Marshall Mathers LP</option>
                <option value={3}>All Eyez on Me</option>
                <option value={4}>Ready To Die</option>
                <option value={5}>Enter the Wu-Tang</option>
                <option value={6}>The Eminem Show</option>
                <option value={7}>The Chronic</option>
                <option value={8}>Straight Outta Compton</option>
                <option value={9}>Reasonable Doubt</option>
            </Select>

            <div>
                <div>
                    <Toggle
                        name="showtextareatoggle"
                        id="showtextareatoggle"
                        isOn={formData.showtextareatoggle === 'on'}
                        label="Show TextArea"
                        onChange={() => null}
                    />
                </div>
                {formData.showtextareatoggle === 'on' ? (
                    <TextArea name="textarea" label="Your story" placeholder="Once upon a time" />
                ) : null}
            </div>

            <Button type={ButtonType.SUBMIT}>Submit</Button>
        </Form>
    );
};

export default {
    title: 'Components/Form Elements/Form',
    component: Form,
    parameters: {
        notes,
    },
};
