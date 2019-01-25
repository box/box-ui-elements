The `Flyout` component is used to tether an arbitrary popover panel to an on-screen button. It relies
on the [tether project](http://tether.io) and [`react-tether`](https://github.com/danreeves/react-tether),
which have documentation on parameters used by this component (e.g., `offset`).

### Examples

**Bottom Right**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;

<Flyout closeOnClickOutside={ false } className="hellooo">
    <Button>Nothing to see here</Button>
    <Overlay>
        <div className="accessible-overlay-content">
            <p>Try hit Tab key.</p>
            <p>Now try click outside, go ahead.</p>
            <br />
            <p><i>You are not going anywhere.</i></p>
        </div>
    </Overlay>
</Flyout>
```

**Bottom Left**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;

<Flyout position="bottom-left">
    <Button>Bottom Left</Button>
    <Overlay>
        <div className="accessible-overlay-content">
            Hi
        </div>
    </Overlay>
</Flyout>
```

**Bottom Center**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;

<Flyout position="bottom-center">
    <Button>Bottom Center</Button>
    <Overlay>
        <div className="accessible-overlay-content">
            Hi
        </div>
    </Overlay>
</Flyout>
```

**Top Left**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;

<Flyout position="top-left">
    <Button>Top Left</Button>
    <Overlay>
        <div className="accessible-overlay-content">
            Hi
        </div>
    </Overlay>
</Flyout>
```

**Top Right**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;

<Flyout position="top-right">
    <Button>Top Right</Button>
    <Overlay>
        <div className="accessible-overlay-content">
            Hi
        </div>
    </Overlay>
</Flyout>
```

**Top Center**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;

<Flyout position="top-center">
    <Button>Top Center</Button>
    <Overlay>
        <div className="accessible-overlay-content">
            Hi
        </div>
    </Overlay>
</Flyout>
```

**Middle Right**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;

<Flyout position="middle-right">
    <Button>Middle Right</Button>
    <Overlay>
        <div className="accessible-overlay-content">
            Hi
        </div>
    </Overlay>
</Flyout>
```

**Middle Left**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;

<Flyout position="middle-left">
    <Button>Middle Left</Button>
    <Overlay>
        <div className="accessible-overlay-content">
            Hi
        </div>
    </Overlay>
</Flyout>
```

**Open on Hover**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;

<Flyout openOnHover>
    <Button>Open on Hover</Button>
    <Overlay>
        <div className="accessible-overlay-content">
            <h1>Some text</h1>
            <p>Some more text</p>
            <br/>
            <a href="https://google.com">Go to Google?</a>
        </div>
    </Overlay>
</Flyout>
```

**Complex**

```
const Flyout = require('box-ui-elements/es/components/flyout').Flyout;
const Overlay = require('box-ui-elements/es/components/flyout').Overlay;
const IconHelp = require('box-ui-elements/es/icons/general/IconHelp').default;

<Flyout className="amsterdam-survey-overlay" offset="0 0">
    <PlainButton className="amsterdam-survey-button">
        <IconHelp />
    </PlainButton>
    <Overlay>
        <div>
            <TextArea name="textarea" label="Provide Feedback" />
        </div>
        <div>
            <TextInput
                name="email"
                label="Email Address"
                placeholder="user@example.com"
                type="email"
            />
        </div>
        <div className="icon-menu-container">
            <PrimaryButton>Submit</PrimaryButton>
            <Button>Close</Button>
        </div>
    </Overlay>
</Flyout>
```
