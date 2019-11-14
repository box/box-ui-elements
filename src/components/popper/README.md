The `PopperComponent` component is used to append an arbitrary popover panel to an on-screen element. It relies
on the [popper.js project](https://popper.js.org/) and [`react-popper`](https://fezvrasta.github.io/react-popper/),
which have documentation on parameters used by this component (e.g., `modifiers`).

It expects two children where the first child is the reference element and the second child is the popper content.

### Examples

**auto placement**

```js
<div style={{position: 'relative'}}>
    <PopperComponent isOpen>
        <div className="flex-center-center" style={{border: "1px solid black", width: '200px', height: '100px', cursor: 'pointer'}}>Reference Element</div>
        <div className="flex-center-center" style={{width: '100px', height: '50px', backgroundColor: '#4e4e4e', color: '#fff'}}>I'm a popper</div>
    </PopperComponent>
</div>
```

**bottom-end**

```js
<div style={{position: 'relative'}}>
    <PopperComponent isOpen placement="bottom-end">
        <div className="flex-center-center" style={{border: "1px solid black", width: '200px', height: '100px', cursor: 'pointer'}}>Reference Element</div>
        <div className="flex-center-center" style={{width: '100px', height: '50px', backgroundColor: '#4e4e4e', color: '#fff'}}>I'm a popper</div>
    </PopperComponent>
</div>
```

**top-end**

```js
<div style={{position: 'relative'}}>
    <PopperComponent isOpen placement="top-end">
        <div className="flex-center-center" style={{border: "1px solid black", width: '200px', height: '100px', cursor: 'pointer'}}>Reference Element</div>
        <div className="flex-center-center" style={{width: '100px', height: '50px', backgroundColor: '#4e4e4e', color: '#fff'}}>I'm a popper</div>
    </PopperComponent>
</div>
```
