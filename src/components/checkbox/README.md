### Examples
**Basic**
```
<Checkbox
    fieldLabel="Field Label"
    id="1"
    name="checkbox1"
    label="Uncontrolled checkbox"
    description="isChecked is undefined, which makes this an uncontrolled component. You can turn this one on-off whenever you feel like!"
/>
```
**Controlled**
```
initialState = { isChecked: false };
const handleChange = () => setState({ isChecked: !state.isChecked });

<div>
    <Checkbox
        name="checkbox2"
        label="Controlled checkbox"
        isChecked={ state.isChecked }
        onChange={ handleChange }
        description="This is a controlled component."
    />
    <Checkbox
        name="checkbox3"
        label="Inverted Controlled checkbox"
        isChecked={ !state.isChecked }
        onChange={ handleChange }
        description="This is a controlled component, whose value is the inverse of the one above."
    />
</div>
```
**Disabled**
```
<Checkbox
    name="checkbox5"
    label="Disabled"
    isChecked
    isDisabled
/>
```
**Tooltip**
```
<Checkbox
    name="checkbox6"
    label="I have a tooltip"
    tooltip="See? Isn’t this great??"
/>
```
**Subsection**
```
<Checkbox
    id="321"
    name="checkbox321"
    label="Checkbox with subsection"
    subsection={ 
        <Checkbox
            id="134"
            name="checkbox134"
            label="Subsection checkbox"
            description="Hi I'm a description"
        />
        }
/>
```
