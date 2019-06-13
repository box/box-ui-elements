### Description
Renders a classification badge and advisory message.

### Examples

**Classification with advisory message**
```jsx
<Classification
    advisoryMessage="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    messageStyle="inline"
    name="Confidential"
/>
```

**Classification with advisory message in a tooltip**
```jsx
<Classification
    advisoryMessage="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    messageStyle="tooltip"
    name="Confidential"
/>
```

**Not Classified Badge to add classification**
```jsx
<Classification />
```

**Not Classified Text**
```jsx
<Classification messageStyle="inline" />
```
