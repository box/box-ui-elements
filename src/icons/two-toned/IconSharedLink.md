### Examples

#### IconSharedLink

```
<IconSharedLink />
```

#### IconSharedLink with CSS overrides

```jsx
<div style={{ backgroundColor: 'black', padding: '5px' }}>
    <style>
        {`
        .icon-shared-link-example .primary-color {
            fill: #fff;
        }

        .icon-shared-link-example .secondary-color {
            fill: #0061d5;
        }
    `}
    </style>
    <IconSharedLink className="icon-shared-link-example" />
</div>
```
