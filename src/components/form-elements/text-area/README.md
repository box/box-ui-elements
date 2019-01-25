### Examples
**Basic**
```
const TextArea = require('box-ui-elements/es/components/form-elements/text-area').default;

<TextArea
    name="textarea"
    label="Your story"
    placeholder="Once upon a time"
/>
```

**Validated Text Area**
```
const TextArea = require('box-ui-elements/es/components/form-elements/text-area').default;

function textAreaValidator(value) {
    if (!value.includes('www')) {
        return {
            code: 'nowww',
            message: 'Text must have "www" in it',
        };
    }
    return null;
};
<TextArea
    name="textarea"
    label="Validated Text Area"
    placeholder="Once upon a time"
    validation={ textAreaValidator }
/>
```
