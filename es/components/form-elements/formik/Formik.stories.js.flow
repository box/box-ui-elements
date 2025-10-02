// @flow
import * as React from 'react';
import { Field, Form, Formik } from 'formik';

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
                        <Field name="checkbox" label="Checkbox Field" component={Checkbox} />
                        <Field name="toggle" label="Toggle Field" component={Toggle} />
                        <Field
                            isRequired
                            label="Text Input Field"
                            name="textinput"
                            type="text"
                            placeholder="Text Input Field"
                            component={TextInput}
                        />
                        <Field
                            isRequired
                            label="Text Area Field"
                            name="textarea"
                            placeholder="Text Area Field"
                            component={TextArea}
                        />
                        <b>Non-RadioGroup RadioButtons sharing the same name</b>
                        <br />
                        <br />
                        <Field
                            isSelected={false}
                            label="Radio Button Field 1"
                            name="radiobutton"
                            component={RadioButtonField}
                            value="radio1"
                        />
                        <Field
                            isSelected={false}
                            label="Radio Button Field 2"
                            name="radiobutton"
                            component={RadioButtonField}
                            value="radio2"
                        />
                        <br />
                        <Field
                            label="Single Select Field"
                            name="singleselect"
                            placeholder="Single Select Field"
                            options={[
                                { displayText: 'Red', value: 'red' },
                                { displayText: 'Green', value: 'green' },
                                { displayText: 'Blue', value: 'blue' },
                            ]}
                            component={SelectField}
                        />
                        <br />
                        <br />
                        <Field
                            label="Multi Select Field"
                            name="multiselect"
                            placeholder="Multi Select Field"
                            multiple
                            options={[
                                { displayText: 'Red', value: 'red' },
                                { displayText: 'Green', value: 'green' },
                                { displayText: 'Blue', value: 'blue' },
                            ]}
                            component={SelectField}
                        />
                        <br />
                        <br />
                        <b>RadioGroup-ed RadioButtons</b>
                        <br />
                        <br />
                        <Field name="radiogroup" component={RadioGroup}>
                            <RadioButton label="Red" value="red" description="Red color" />
                            <RadioButton label="Blue" value="blue" description="Blue color" />
                        </Field>
                        <br />
                        <br />
                        <Field
                            label="Pill Selector Field"
                            name="pillselector"
                            placeholder="Colors"
                            component={PillSelectorDropdownField}
                            validator={pillSelectorValidator}
                        />
                        <br />
                        <br />
                        <Field
                            label="Pill Selector Field With Dropdown"
                            name="pillselectordropdown"
                            placeholder="Colors"
                            options={[
                                { displayText: 'Red', value: 'red' },
                                { displayText: 'Green', value: 'green' },
                                { displayText: 'Blue', value: 'blue' },
                            ]}
                            component={PillSelectorDropdownField}
                            validator={pillSelectorValidator}
                            dropdownRenderer={options =>
                                options.map(option => (
                                    <DatalistItem key={option.value} style={{ color: option.value }}>
                                        {option.displayText}
                                    </DatalistItem>
                                ))
                            }
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
    title: 'Components/Formik Elements',
    parameters: {
        notes,
    },
};
