`import CollapsibleSidebar from 'box-ui-elements/es/components/collapsible-sidebar';`

A sidebar navigation component with custom scrollbars (normalized scrollbar appearance across browsers).

- `CollapsibleSidebar`
  - `expanded` prop; whether the component is horizontally expanded (i.e., detect screen size and collapse the sidebar using this prop)
- `CollapsibleSidebarLogo` pinned to top
- `CollapsibleSidebarFooter` pinned to bottom
- `CollapsibleSidebarNav` wraps nav items with scrollbar and scroll shadow effect
  - `CollapsibleSidebarItem` horizontally collapsible container
    - `collapsedElement`|`expandedElement` usually a `CollapsibleSidebarMenuItem`
  - `CollapsibleSidebarMenuItem` standard display element for nav entries
    - `text` prop (optional); usually unset when collapsed
    - `shouldHideTooltip` prop (optional); usually set to true when another tooltip is showing
    - `icon` prop (optional) + `tooltipMessage` prop; typical collapsed presentation

## Example

```js
<CollapsibleSidebar expanded={isExpanded}>
  <CollapsibleSidebarLogo linkProps={{}} onToggle={fn} expanded={isExpanded} />
  <CollapsibleSidebarNav
    className="my-nav-wrapper"
    customScrollBarProps={{ /* react-scrollbars-custom props */ }}
  >
    <ul>
      <li>
        <CollapsibleSidebarItem
          expanded={isExpanded}
          collapsedElement={
            <CollapsibleSidebarMenuItem
              as={Link}
              href="/"
              icon={<Folder16 height={20} width={20} />}
              linkClassName="is-currentPage"
            />
          }
          expandedElement={
            <CollapsibleSidebarMenuItem
              as={Link}
              href="/"
              icon={<Folder16 height={20} width={20} />}
              linkClassName="is-currentPage"
              text="All Files"
            />
          }
          tooltipMessage="All Files Link"
        />
      </li>
    </ul>
  </CollapsibleSidebarNav>
  <CollapsibleSidebarFooter>
    <ul>
      {*/ More li > CollapsibleSidebarItem components */}
    </ul>
  </CollapsibleSidebarFooter>
</CollapsibleSidebar>
```
