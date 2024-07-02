### Description

Traps tab focus within the children of the focus. Should be used for overlays, modals, and similar features, for accessibility. It will also save and return focus to the previously focused element on mount/unmount.

### Examples

**With focusable children**

```js
const [state, setState] = React.useState({ isVisible: false });

<div>
  {state.isVisible && (
    <FocusTrap style={{ border: '1px solid black', padding: '20px' }}>
      <p>
        <a href="#">focusable el</a>
      </p>
      <p>non-focusable el</p>
      <p>
        <a href="#">focusable el</a>
      </p>
      <p>non-focusable el</p>
      <Button
        onClick={() =>
          setState(prevState => ({ ...prevState, isVisible: false }))
        }
      >
        Close example and return focus
      </Button>
    </FocusTrap>
  )}
  <Button
    onClick={() =>
      setState(prevState => ({ ...prevState, isVisible: !state.isVisible }))
    }
  >
    Toggle example
  </Button>
</div>;
```

**Without focusable children**

```js
const [state, setState] = React.useState({ isVisible: false });

<div>
  {state.isVisible && (
    <FocusTrap style={{ border: '1px solid black', padding: '20px' }}>
      <p>
        non-focusable els, but focus is still trapped. For accessibility, there
        should always be a way for the user to un-trap themselves using the
        keyboard (e.g. using the escape key).
      </p>
    </FocusTrap>
  )}
  <Button
    onClick={() =>
      setState(prevState => ({ ...prevState, isVisible: !state.isVisible }))
    }
  >
    Toggle example
  </Button>
</div>;
```
