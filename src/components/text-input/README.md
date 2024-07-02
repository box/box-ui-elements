### Descriptions
In addition to the properties defined above, you can also specify any of the `input` element's properties (see [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input)) and they will be used as well.

### Examples
**Basic**
```
    <TextInput label='Email' name='textinput' type="email" placeholder='Enter email here' />
```
**Basic with description**
```
    <TextInput description='Email used for work' label='Email' name='textinput' type="email" placeholder='Enter email here' />
```
**Basic with long breakable strings**
```
    <TextInput description='Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long' label='Long Long Long Long long long Long Long Long Long long longLong Long Long Long long longLong Long Long Long long long' name='textinput' type="email" placeholder='Enter email here' />
```
**Basic with long unbreakable strings**
```
    <TextInput description='longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong' label='longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong' name='textinput' type="email" placeholder='Enter email here' />
```
**Error**
```
    <TextInput label='Email' name='textinput' type="email" error='oops' placeholder='Enter email here' />
```
**Loading**
```
    <TextInput label='Email' name='textinput' type="email" isLoading placeholder='Enter email here' />
```
**Valid**
```
    <TextInput label='Email' name='textinput' type="email" isValid placeholder='Enter email here' />
```
**Required with onChange**
```jsx
    const [state, setState] = React.useState({ error: 'required', value: '' });
    <TextInput
        label='Email'
        name='textinput'
        type="text"
        placeholder='Enter email here'
        value={state.value}
        error={state.error}
        onChange={(e) => setState(prevState => ({ ...prevState, error: e.target.value ? '' : 'required', value: e.target.value }))}
    />
```
