### Examples

#### Using `NavList`

```
const NavList = require('./NavList').default;

<NavSidebar data-resin-component="leftnav">
    <NavList>
        <Link>Item 1-1</Link>
        <Link>Item 1-2</Link>
    </NavList>
    <NavList heading="Item 2">
        <Link>Item 2-1</Link>
        <Link>Item 2-2</Link>
        <Link>Item 2-3</Link>
    </NavList>
</NavSidebar>

```

#### Using `NavListCollapsible`

```
const NavList = require('./NavList').default;
const NavListCollapseHeader = require('./NavListCollapseHeader').default;

const [isCollapsed, setIsCollapsed] = React.useState(false);

const handleOnToggle = (ev) => {
    setIsCollapsed(!isCollapsed)
};

<NavSidebar data-resin-component="leftnav">
    <NavList
        heading={
            <NavListCollapseHeader onToggleCollapse={ handleOnToggle }>
                Collapse or Expand
            </NavListCollapseHeader>
        }
        className="is-collapsible example-collapsible"
        collapsed={isCollapsed}
    >
        <Link>Item 1-1</Link>
        <Link>Item 1-2</Link>
    </NavList>
    <NavList heading="Item 2">
        <Link>Item 2-1</Link>
        <Link>Item 2-2</Link>
        <Link>Item 2-3</Link>
    </NavList>
</NavSidebar>

```
