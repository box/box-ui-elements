### Examples
```
<PlainButton>Plain button</PlainButton>
```

Disabled with tooltip:

```js
const Tooltip = require('box-ui-elements/es/components/tooltip').default;

<Tooltip text="This tooltip is shown on a disabled button but nothing will happen when the button is clicked.">
    <PlainButton isDisabled onClick={ () => { alert('not happening'); } }>
        Disabled Button with Tooltip
    </PlainButton>
</Tooltip>
```
