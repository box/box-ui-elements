### Examples
**Email**
```
const TextInput = require('box-ui-elements/es/components/form-elements/text-input').default;

<TextInput
    label="Email Address"
    name="email"
    placeholder="user@example.com"
    type="email"
    value="aaron@example.com"
/>
```
**Url**
```
const TextInput = require('box-ui-elements/es/components/form-elements/text-input').default;

<TextInput
    label="Url"
    name="url"
    placeholder="https://box.com"
    type="url"
/>
```
**Must Say Box**
```
const TextInput = require('box-ui-elements/es/components/form-elements/text-input').default;

function customFn(value) {
    if (value !== 'box') {
        return {
            code: 'notbox',
            message: 'value is not box',
        };
    }
    return null;
};

<TextInput
    label="Must Say Box"
    name="customValidationFunc"
    placeholder="Not Box"
    type="text"
    validation={ customFn }
/>
```
**Minimum length**
```
const TextInput = require('box-ui-elements/es/components/form-elements/text-input').default;

<TextInput
    minLength={ 3 }
    name="minlenCheck"
    label="Minimum length"
    placeholder="Three or more"
    type="text"
/>
```
**Maximum length**
```
const TextInput = require('box-ui-elements/es/components/form-elements/text-input').default;

<TextInput
    maxLength={ 5 }
    name="maxlenCheck"
    label="Maximum length"
    placeholder="Five or less"
    type="text"
/>
```
**Tooltip on hover**
```
const TextInput = require('box-ui-elements/es/components/form-elements/text-input').default;

<TextInput
    name="tooltipCheck"
    label="Tooltip on hover"
    placeholder="Hover over the label"
    type="text"
    labelTooltip="I am the tooltip"
/>
```
**Label Hidden**
```
const TextInput = require('box-ui-elements/es/components/form-elements/text-input').default;

 <TextInput
    label="This label text should be hidden"
    name="hidden label"
    placeholder="Hidden (but accessible) label text"
    type="text"
    hideLabel
/>
```
**Disabled**
```
const TextInput = require('box-ui-elements/es/components/form-elements/text-input').default;

<TextInput
    name="disabled"
    isDisabled
    label="Disabled"
    placeholder="Disabled input"
    type="text"
/>
```
**Loading**
```
const TextInput = require('box-ui-elements/es/components/form-elements/text-input').default;

<TextInput
    name="loading"
    isDisabled
    isLoading
    label="Loading"
    placeholder="loading..."
    type="text"
/>
```
