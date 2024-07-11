### Examples
**Basic**
```
<TextAreaElement
    name="textarea"
    label="Your story"
    placeholder="Once upon a time"
/>
```

**Validated Text Area**
```
function textAreaValidator(value) {
    if (!value.includes('www')) {
        return {
            code: 'nowww',
            message: 'Text must have "www" in it',
        };
    }
    return null;
};
<TextAreaElement
    name="textarea"
    label="Validated Text Area"
    placeholder="Once upon a time"
    validation={ textAreaValidator }
/>
```
