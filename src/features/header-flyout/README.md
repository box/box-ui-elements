This feature is for embedding `Flyout` components with a custom trigger button in a header of the page. It defines the default container structure, and styling for BDL flyouts used in a header bar.

### Example

```js
<div style={{
    height: '500px',
}}>
    <div style={{
        display: 'flex',
        'flex-direction': 'row-reverse',
    }}>
        <HeaderFlyout
            flyoutButton={<Button>Test</Button>}
            footer={<span>Footer Text</span>}
            header={<span>Header Text</span>}
            onOpen={() => {}}
            onClose={() => {}}
        >
            <div style={{height: '600px', backgroundColor: '#fafafa'}}>
                Render Row Contents
            </div>
        </HeaderFlyout>
    </div>
</div>
```