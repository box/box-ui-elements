### Examples
```js
const Select = require('box-ui-elements/es/components/select').default;
const Toggle = require('box-ui-elements/es/components/toggle').default;
const Button = require('box-ui-elements/es/components/button').default;

const customValidFn = function customFn(value) {
    if (value !== 'box') {
        return {
            code: 'notbox',
            message: 'value is not box',
        };
    }
    return null;
};

const [state, setState] = React.useState({
    formData: {
        showtextareatoggle: '',
    },
    formValidityState: {},
});

<FormElement
    onChange={ formData => {
        setState(prevState => ({ ...prevState, formValidityState: {}, formData }));
    } }
    onValidSubmit={ () => {
        // On a server validation error, set formValidityState to
        // push error states to child inputs
        setState(prevState => ({
            ...prevState,
            formValidityState: {
                username: {
                    code: 'usernametaken',
                    message: 'Username already taken.',
                },
            },
        }));
    } }
    onInvalidSubmit={ formValidityState =>
        console.log(formValidityState) }
    formValidityState={ state.formValidityState }
>
    <div>
        <TextInputElement
            name="username"
            label="Username"
            placeholder="swagmaster6"
            type="text"
            isRequired
        />
    </div>
    <div>
        <TextInputElement
            name="email"
            label="Email Address"
            placeholder="user@example.com"
            type="email"
        />
    </div>
    <div>
        <TextInputElement
            label="Must Say Box"
            name="customValidationFunc"
            placeholder="Not Box"
            type="text"
            validation={ customValidFn }
        />
    </div>

    <Select name="albumselect" label="Album">
        <option value={ 1 }>Illmatic</option>
        <option value={ 2 }>The Marshall Mathers LP</option>
        <option value={ 3 }>All Eyez on Me</option>
        <option value={ 4 }>Ready To Die</option>
        <option value={ 5 }>Enter the Wu-Tang</option>
        <option value={ 6 }>The Eminem Show</option>
        <option value={ 7 }>The Chronic</option>
        <option value={ 8 }>Straight Outta Compton</option>
        <option value={ 9 }>Reasonable Doubt</option>
    </Select>

    <div>
        <div>
            <Toggle
                name="showtextareatoggle"
                id="showtextareatoggle"
                label="Show TextArea"
                isOn={
                    state.formData
                        .showtextareatoggle === 'on'
                }
            />
        </div>
        {state.formData.showtextareatoggle === 'on'
            ? <TextAreaElement
                    name="textarea"
                    label="Your story"
                    placeholder="Once upon a time"
                />
            : null}
    </div>

    <Button type="submit">Submit</Button>
</FormElement>
```
