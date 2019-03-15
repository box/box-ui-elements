### Description

Renders a small tab with text in the bottom-left corner of a page.

### Examples

#### Standard

```
<div style={{
    height: '250px',
    position: 'relative',
    transform: 'translate3d(0,0,0)',
}}>
    <FooterIndicator
        indicatorText="FooterIndicator"
    />
</div>
```

#### With text overflow

```
<div style={{
    height: '250px',
    position: 'relative',
    transform: 'translate3d(0,0,0)',
}}>
    <FooterIndicator
        indicatorText="FooterIndicatorWithExtremelyLongName"
    />
</div>
```
