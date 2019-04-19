### Examples
**Basic**
```
const TextArea = require('box-ui-elements/es/components/text-area').default;

<TextArea
    name="textarea"
    label="Your story"
    placeholder="Once upon a time"
/>
```

**Basic with (optional) text hidden**
```
const TextArea = require('box-ui-elements/es/components/text-area').default;

<TextArea
    hideOptionalLabel
    name="textarea"
    label="Your story"
    placeholder="Once upon a time"
/>
```

**Required**
```
const TextArea = require('box-ui-elements/es/components/text-area').default;

<TextArea
    isRequired
    name="textarea"
    label="Your required story"
    placeholder="Once upon a time"
/>
```

**With Hidden Label**
```
const TextArea = require('box-ui-elements/es/components/text-area').default;

<TextArea
    hideLabel
    name="textarea"
    label="Your hidden label"
    placeholder="Once upon a time"
/>
```
