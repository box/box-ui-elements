// @flow
import * as React from 'react';
import { Field, Form, Formik } from 'formik';
import { boolean } from '@storybook/addon-knobs';

import TextInput from '../../text-input/TextInput';
import TextArea from '../../text-area/TextAreaField';
import Toggle from '../../toggle/ToggleField';
import Checkbox from '../../checkbox/CheckboxField';
import SelectField from '../../select-field/SelectField';
import PillSelectorDropdownField from '../../pill-selector-dropdown/PillSelectorDropdownField';
import DatalistItem from '../../datalist-item/DatalistItem';

import { RadioButton, RadioButtonField, RadioGroup } from '../../radio';

import notes from './Formik.stories.md';

export const basic = () => {
    const pillSelectorValidator = option => {
        const value = typeof option === 'string' ? option : option.value;
        return ['red', 'green', 'blue', 'yellow', 'white', 'black'].includes(value);
    };

    return (
        <Formik
            initialValues={{
                checkbox: true,
                pillselector: [],
                radiogroup: 'red',
                textarea: 'textarea',
                textinput: 'textinput',
                toggle: true,
            }}
            onSubmit={() => null}
            validate={values => {
                const errors = {};
                const { textinput, textarea, pillselector } = values;

                if (!textinput) {
                    errors.textinput = 'Required';
                }

                if (!textarea) {
                    errors.textarea = 'Required';
                }

                if (Array.isArray(pillselector) && !pillselector.every(pill => pillSelectorValidator(pill))) {
                    errors.pillselector = 'Bad colors';
                }

                return errors;
            }}
        >
            {props => (
                <>
                    <Form
                        style={{
                            display: 'inline-block',
                        }}
                    >
                        <Field component={Checkbox} label="Checkbox Field" name="checkbox" />
                        <Field component={Toggle} label="Toggle Field" name="toggle" />
                        <Field
                            component={TextInput}
                            isRequired={boolean('isRequired', true)}
                            label="Text Input Field"
                            name="textinput"
                            placeholder="Text Input Field"
                            type="text"
                        />
                        <Field
                            component={TextArea}
                            isRequired={boolean('isRequired', true)}
                            label="Text Area Field"
                            name="textarea"
                            placeholder="Text Area Field"
                        />
                        <b>Non-RadioGroup RadioButtons sharing the same name</b>
                        <br />
                        <br />
                        <Field
                            component={RadioButtonField}
                            isSelected={false}
                            label="Radio Button Field 1"
                            name="radiobutton"
                            value="radio1"
                        />
                        <Field
                            component={RadioButtonField}
                            isSelected={false}
                            label="Radio Button Field 2"
                            name="radiobutton"
                            value="radio2"
                        />
                        <br />
                        <Field
                            component={SelectField}
                            label="Single Select Field"
                            name="singleselect"
                            options={[
                                { displayText: 'Red', value: 'red' },
                                { displayText: 'Green', value: 'green' },
                                { displayText: 'Blue', value: 'blue' },
                            ]}
                            placeholder="Single Select Field"
                        />
                        <br />
                        <br />
                        <Field
                            component={SelectField}
                            label="Multi Select Field"
                            multiple
                            name="multiselect"
                            options={[
                                { displayText: 'Red', value: 'red' },
                                { displayText: 'Green', value: 'green' },
                                { displayText: 'Blue', value: 'blue' },
                            ]}
                            placeholder="Multi Select Field"
                        />
                        <br />
                        <br />
                        <b>RadioGroup-ed RadioButtons</b>
                        <br />
                        <br />
                        <Field component={RadioGroup} name="radiogroup">
                            <RadioButton description="Red color" label="Red" value="red" />
                            <RadioButton description="Blue color" label="Blue" value="blue" />
                        </Field>
                        <br />
                        <br />
                        <Field
                            component={PillSelectorDropdownField}
                            label="Pill Selector Field"
                            name="pillselector"
                            placeholder="Colors"
                            validator={pillSelectorValidator}
                        />
                        <br />
                        <br />
                        <Field
                            component={PillSelectorDropdownField}
                            dropdownRenderer={options =>
                                options.map(option => (
                                    <DatalistItem key={option.value} style={{ color: option.value }}>
                                        {option.displayText}
                                    </DatalistItem>
                                ))
                            }
                            label="Pill Selector Field With Dropdown"
                            name="pillselectordropdown"
                            options={[
                                { displayText: 'Red', value: 'red' },
                                { displayText: 'Green', value: 'green' },
                                { displayText: 'Blue', value: 'blue' },
                            ]}
                            placeholder="Colors"
                            validator={pillSelectorValidator}
                        />
                    </Form>
                    <pre
                        style={{
                            color: '#fff',
                            background: '#0061D5',
                            fontSize: '14px',
                            padding: '.5rem',
                            float: 'right',
                            display: 'inline-block',
                        }}
                    >
                        <strong>Formik State</strong> = {JSON.stringify(props, null, 2)}
                    </pre>
                </>
            )}
        </Formik>
    );
};

export default {
    title: 'Components|Formik Elements',
    parameters: {
        notes,
    },
};
