## Portal

Render children into an outside DOM hierarchy. Useful for modals, notifications, popovers, flyouts,
etc.

* `Portal` only handles the outside DOM mounting/unmounting logic.
* All styles, event handlers, and behaviors must be implemented by the parent component.
* Context is passed from the Portal parent to the children components
* All props passed to `Portal` are passed to the inner-wrapper div

### Usage

```jsx
import { Portal } from 'box-ui-elements';

const MyPortalExample = () => {
    if (!this.props.isOpen) return null;
    return (
        <Portal className='modal-wrapper'>
            <div className='modal'>...</div>
        </Portal>
    );
}

// Which renders:

<body>
    <div id="my-normal-react-container">...</div>
    <div data-portal>
        <div class="modal-wrapper">
            <div class="modal">...</div>
        </div>
    </div>
</body>
```
