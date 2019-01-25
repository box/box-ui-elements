### Examples

```
<LinkPrimaryButton href='#'>
    A link that looks like a primary button
</LinkPrimaryButton>
```

You can pass a custom component to be used instead of the default `a` tag:

```
// Could be a React-Router link:
// import { Link as RouterLink } from 'react-router'

const RouterLink = ({ to, children, ...rest }) => (
    <a { ...rest } href={ to }>
        {children}
    </a>
);

<LinkPrimaryButton to='/somewhere' component={RouterLink}>
    A link
</LinkPrimaryButton>
```
