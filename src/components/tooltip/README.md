### Top-Left, Basic
```js
<Tooltip
    text="tooltips are constrained to window by default so if you scroll until there is no room for this tooltip above the button, it will flip below the button"
    position="top-left"
>
    <Button>top-left</Button>
</Tooltip>
```
### Top-Center, Disabled Button
```js
<Tooltip text="default tooltip with top-center positioning and default theme, works on disabled buttons">
    <Button isDisabled>top-center</Button>
</Tooltip>
```
### Top-Right, Callout Theme
```js
<Tooltip
    text="callout theme"
    position="top-right"
    theme="callout"
>
    <Button>Callout</Button>
</Tooltip>
```
### Middle-Right, Callout Theme, Force Shown With Close Button
```js
<Tooltip
    text="callout theme"
    position="middle-right"
    theme="callout"
    isShown
    showCloseButton
>
    <Button>Callout With Close Button</Button>
</Tooltip>
```
### Top-Right, Error Theme
```js
<Tooltip
    text="error theme"
    position="top-right"
    theme="error"
>
    <Button>top-right</Button>
</Tooltip>
```
### Middle-Left, long tooltip text
```js
<Tooltip
    text="this is a long tooltip that will wrap past 200px width, add a tooltipClass to override"
    position="middle-left"
>
    <Button>middle-left</Button>
</Tooltip>
```
### Middle-Right, isShown prop true
```js
<Tooltip
    text="controlled tooltip that is shown based only on the isShown prop"
    position="middle-right"
    isShown
>
    <Button>middle-right</Button>
</Tooltip>
```
### Bottom-Left
```js
<Tooltip
    text="bottom-left positioning"
    position="bottom-left"
>
    <Button>bottom-left</Button>
</Tooltip>
```
### Bottom-Center
```js
 <Tooltip
    text="bottom-center positioning"
    position="bottom-center"
>
    <Button>bottom-center</Button>
</Tooltip>
```
### Bottom-Right
```js
<Tooltip
    text="bottom-right positioning"
    position="bottom-right"
>
    <Button>bottom-right</Button>
</Tooltip>
```
