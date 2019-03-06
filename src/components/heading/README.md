### Examples
**H1**
```
<Heading level={1}>
    Box Design Language
</Heading>
```

**H2**
```
<Heading level={2}>
    Box Design Language
</Heading>
```

**H3**
```
<Heading level={3}>
    Box Design Language
</Heading>
```

**H4**
```
<Heading level={4}>
    Box Design Language
</Heading>
```

**H5**
```
<Heading level={5}>
    Box Design Language
</Heading>
```

**H6**
```
<Heading level={6}>
    Box Design Language
</Heading>
```

**H3 via context with some overrides**
```js
const HeadingProvider = require('./HeadingProvider').default;

<HeadingProvider value={3}>
    <Heading>
        H3 - Box Design Language
    </Heading>
    <Heading>
        H3 - Box Design Language
    </Heading>
    <Heading level={1}>
        H1 - Box Design Language
    </Heading>
    <Heading level={6}>
        H6 - Box Design Language
    </Heading>
</HeadingProvider>
```
