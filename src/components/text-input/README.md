### Descriptions
In addition to the properties defined above, you can also specify any of the `input` element's properties (see [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input)) and they will be used as well.

### Examples
**Basic**
```
    const TextInput = require('box-ui-elements/es/components/text-input').default;
    <TextInput label='Email' name='textinput' type="email" placeholder='Enter email here' />
```
**Basic with description**
```
    const TextInput = require('box-ui-elements/es/components/text-input').default;
    <TextInput description='Email used for work' label='Email' name='textinput' type="email" placeholder='Enter email here' />
```
**Basic with long breakable strings**
```
    const TextInput = require('box-ui-elements/es/components/text-input').default;
    <TextInput description='Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long' label='Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long' name='textinput' type="email" placeholder='Enter email here' />
```
**Basic with long unbreakable strings**
```
    const TextInput = require('box-ui-elements/es/components/text-input').default;
    <TextInput description='longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong' label='longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong' name='textinput' type="email" placeholder='Enter email here' />
```
**Error**
```
    const TextInput = require('box-ui-elements/es/components/text-input').default;
    <TextInput label='Email' name='textinput' type="email" error='oops' placeholder='Enter email here' />
```
**Loading**
```
    const TextInput = require('box-ui-elements/es/components/text-input').default;
    <TextInput label='Email' name='textinput' type="email" isLoading placeholder='Enter email here' />
```
**Valid**
```
    const TextInput = require('box-ui-elements/es/components/text-input').default;
    <TextInput label='Email' name='textinput' type="email" isValid placeholder='Enter email here' />
```
**Required with onChange**
```jsx
    const TextInput = require('box-ui-elements/es/components/text-input').default;
    initialState = { error: 'required', value: '' };
    <TextInput
        label='Email'
        name='textinput'
        type="text"
        placeholder='Enter email here'
        value={state.value}
        error={state.error}
        onChange={(e) => setState({ error: e.target.value ? '' : 'required', value: e.target.value })}
    />
```
