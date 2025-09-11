### Description
Renders a classification badge with classification definition.

### Examples

**Classification with definition**
```jsx
<Classification
    definition="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    messageStyle="inline"
    name="Confidential"
/>
```

**Classification with definition in a tooltip**
```jsx
<Classification
    definition="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    messageStyle="tooltip"
    name="Confidential"
/>
```

**Classification with custom colors**
```jsx
<Classification
    definition="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    color="#f5ebfd"
    messageStyle="inline"
    name="Confidential"
    strokeColor="#9f3fed"
/>
```

**Not Classified Text**
```jsx
<Classification messageStyle="inline" />
```

**Classification with definition and security controls**
```jsx
<Classification
    controls={{
        sharedLink: {
            accessLevel: 'collabOnly',
        },
    }}
    definition="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    messageStyle="inline"
    name="Confidential"
/>
```

**Classification with AI reasoning details**
```jsx
<Classification
    aiClassificationReason={{
        answer: "This document contains sensitive financial information including quarterly earnings data and strategic business plans that require confidential handling.",
        modifiedAt: "2024-01-15T10:30:00Z",
        citations: []
    }}
    definition="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    messageStyle="inline"
    name="Confidential"
/>
```
Make sure that TooltipProvider is in context when using aiClassificationReason with empty citations.
