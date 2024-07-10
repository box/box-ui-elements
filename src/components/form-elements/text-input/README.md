### Examples
**Email**
```
<TextInputElement
    label="Email Address"
    name="email"
    placeholder="user@example.com"
    type="email"
    value="aaron@example.com"
/>
```
**Url**
```
<TextInputElement
    label="Url"
    name="url"
    placeholder="https://box.com"
    type="url"
/>
```
**Must Say Box**
```
function customFn(value) {
    if (value !== 'box') {
        return {
            code: 'notbox',
            message: 'value is not box',
        };
    }
    return null;
};

<TextInputElement
    label="Must Say Box"
    name="customValidationFunc"
    placeholder="Not Box"
    type="text"
    validation={ customFn }
/>
```
**Minimum length**
```
<TextInputElement
    minLength={ 3 }
    name="minlenCheck"
    label="Minimum length"
    placeholder="Three or more"
    type="text"
/>
```
**Maximum length**
```
<TextInputElement
    maxLength={ 5 }
    name="maxlenCheck"
    label="Maximum length"
    placeholder="Five or less"
    type="text"
/>
```
**Tooltip on hover**
```
<TextInputElement
    name="tooltipCheck"
    label="Tooltip on hover"
    placeholder="Hover over the label"
    type="text"
    labelTooltip="I am the tooltip"
/>
```
**Label Hidden**
```
 <TextInputElement
    label="This label text should be hidden"
    name="hidden label"
    placeholder="Hidden (but accessible) label text"
    type="text"
    hideLabel
/>
```
**Disabled**
```
<TextInputElement
    name="disabled"
    isDisabled
    label="Disabled"
    placeholder="Disabled input"
    type="text"
/>
```
**Loading**
```
<TextInputElement
    name="loading"
    isDisabled
    isLoading
    label="Loading"
    placeholder="loading..."
    type="text"
/>
```
