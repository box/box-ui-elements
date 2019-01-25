### Examples
**Basic**
```js
<Toggle
    name="toggle1"
    label="Uncontrolled toggle"
    description="isOn is undefined, which makes this an uncontrolled component. You can turn this one on-off whenever you feel like!"
/>
```
**Right aligned toggle**
```js
<Toggle
    description="isOn is undefined, which makes this an uncontrolled component. You can turn this one on-off whenever you feel like!"
    isToggleRightAligned
    label="Uncontrolled toggle right aligned"
    name="toggle1"
/>
```
**Controlled**
```js
initialState = { isOn: false };
const onToggle = () => setState({ isOn: !state.isOn });

<div>
    <Toggle
        name="toggle2"
        label="Controlled toggle"
        isOn={ state.isOn }
        onChange={ onToggle }
        description="This is a controlled component."
    />
    <Toggle
        name="toggle3"
        label="Inverted Controlled toggle"
        isOn={ !state.isOn }
        onChange={ onToggle }
        description="This is a controlled component, whose value is the inverse of the one above."
    />
</div>
```
**Disabled**
```js
<Toggle name="toggle4" label="Disabled" isDisabled />
```
