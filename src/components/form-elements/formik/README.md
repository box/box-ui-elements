### Examples
```jsx
const { Formik, Form, Field } = require('formik');

const TextInput = require('box-ui-elements/es/components/text-input').TextInputField;
const TextArea = require('box-ui-elements/es/components/text-area').TextAreaField;
const Toggle = require('box-ui-elements/es/components/toggle').ToggleField;
const Checkbox = require('box-ui-elements/es/components/checkbox').CheckboxField;
const RadioGroup = require('box-ui-elements/es/components/radio').RadioGroupField;
const RadioButtonField = require('box-ui-elements/es/components/radio').RadioButtonField;
const RadioButton = require('box-ui-elements/es/components/radio').RadioButton;
const SelectField = require('box-ui-elements/es/components/select-field').SelectField;

<Formik
    initialValues={{
        textinput: 'textinput',
        textarea: 'textarea',
        toggle: true,
        checkbox: true,
        radiogroup: 'red',
    }}
    validate={values => {
        const errors = {};
        const { textinput, textarea } = values;

        if (!textinput) {
            errors.textinput = 'Required';
        }

        if (!textarea) {
            errors.textarea = 'Required';
        }

        return errors;
    }}
    render={props => (
        <React.Fragment>
            <Form>
                <Field
                    name="checkbox"
                    label="Checkbox Field"
                    component={Checkbox}
                />
                <Field
                    name="toggle"
                    label="Toggle Field"
                    component={Toggle}
                />
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
                        { displayText: 'Red', value: 'Red' },
                        { displayText: 'Green', value: 'Green' },
                        { displayText: 'Blue', value: 'Blue' },
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
                        { displayText: 'Red', value: 'Red' },
                        { displayText: 'Green', value: 'Green' },
                        { displayText: 'Blue', value: 'Blue' },
                    ]}
                    component={SelectField}
                />
                <br />
                <br />
                <b>RadioGroup-ed RadioButtons</b>
                <br />
                <br />
                <Field name="radiogroup" component={RadioGroup}>
                    <RadioButton
                        label="Red"
                        value="red"
                        description="Red color"
                    />
                    <RadioButton
                        label="Blue"
                        value="blue"
                        description="Blue color"
                    />
                </Field>
            </Form>
            <br />
            <br />
            <pre
                style={{
                    color: '#fff',
                    background: '#0061D5',
                    fontSize: '14px',
                    padding: '.5rem',
                }}
            >
                <strong>Formik State</strong> = {JSON.stringify(props, null, 2)}
            </pre>
        </React.Fragment>
    )}
/>
```
