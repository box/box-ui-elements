**Annotation icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'IconDrawAnnotation',
        component: require('./IconDrawAnnotation').default,
    },
    {
        name: 'IconHighlightAnnotation',
        component: require('./IconHighlightAnnotation').default,
    },
    {
        name: 'IconHighlightCommentAnnotation',
        component: require('./IconHighlightCommentAnnotation').default,
    },
    {
        name: 'IconPointAnnotation',
        component: require('./IconPointAnnotation').default,
    },
];

<IconsExample icons={icons} />;
```
