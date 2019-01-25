### Examples

```
<Link href='#'>
    A link
</Link>
```

You can pass a custom component to be used instead of the default `a` tag:

```
// Could be a React-Router link:
// import { Link as RouterLink } from 'react-router'

const RouterLink = ({ to, children, ...rest }) => (
    <a {...rest} href={to}>
        {children}
    </a>
);

<Link to='/somewhere' component={RouterLink}>
    A link
</Link>
```
