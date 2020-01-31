The `PopperComponent` component is used to append an arbitrary popover panel to an on-screen element. It relies
on the [popper.js project](https://popper.js.org/) and [`react-popper`](https://fezvrasta.github.io/react-popper/),
which have documentation on parameters used by this component (e.g., `modifiers`).

It expects two children where the first child is the reference element and the second child is the popper content.

### Examples

```js
const flexCenter = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const containerStyles = { marginTop: '120px' };
const referenceStyles = { ...flexCenter, border: "1px solid black", width: '200px', height: '100px' };
const popperStyles = { ...flexCenter, width: '100px', height: '50px', backgroundColor: '#4e4e4e', color: '#fff' };

<React.Fragment>
    <div>
        <Label>Auto placement</Label>
        <div style={{position: 'relative'}}>
            <PopperComponent isOpen>
                <div style={referenceStyles}>Reference Element</div>
                <div style={popperStyles}>I'm a popper</div>
            </PopperComponent>
        </div>
    </div>

    <div style={containerStyles}>
        <Label>bottom-end</Label>
        <div style={{position: 'relative'}}>
            <PopperComponent isOpen placement="bottom-end">
                <div style={referenceStyles}>Reference Element</div>
                <div style={popperStyles}>I'm a popper</div>
            </PopperComponent>
        </div>
    </div>

    <div style={containerStyles}>
        <Label>top-end</Label>
        <div style={{position: 'relative'}}>
            <PopperComponent isOpen placement="top-end">
                <div style={referenceStyles}>Reference Element</div>
                <div style={popperStyles}>I'm a popper</div>
            </PopperComponent>
        </div>
    </div>
</React.Fragment>
```
