Generic wrapper component for adding badges to other containers. Each corner can take in an element that
renders the badge or icon, or other types of components. Positioning can be fine-tuned with style overrides
if necessary, or by wrapping the node with a `className`.

Also allows for tooltip components to wrap the added badges.

**Note**: remember to wrap any non-block components with a block element if you add it to a Tooltip, so that positioning can be calculated.

## Examples

You can badge one of our avatar icons, and use state to change which badges are visible.

```
const BetaBadge = require('../badge/BetaBadge').default;
const Badge = require('../badge/Badge').default;
const IconGlobe = require('../../icons/general/IconGlobe').default;
const IconClock = require('../../icons/general/IconClock').default;
const IconExpirationBadge = require('../../icons/general/IconExpirationBadge').default;
const Avatar = require('../avatar/Avatar').default;
const Tooltip = require('../tooltip/Tooltip').default;

// Try swapping some of the other icons or Badges in below, to test functionality

class BadgeableExample extends React.Component {
    constructor() {
        super();

        this.state = {
            isExpired: false,
            showTooltipBadge: false,
            count: 0,
        }
    }

    toggleExpiry() {
        this.setState({
            isExpired: !this.state.isExpired,
        });
    }

    toggleTooltipButton() {
        this.setState({
            showTooltipBadge: !this.state.showTooltipBadge,
        });
    }

    badgedWithTooltip() {
        return (
            <Tooltip
                text="Here, we add a tooltip to this badge as an example"
                position="middle-right">
                <div>
                    <IconGlobe/>
                </div>
            </Tooltip>
        );
    }

    updateCount() {
        const newCount = this.state.count + 1;

        this.setState({
            count: newCount,
        });
    }

    render() {
        const displayCount = this.state.count < 10 ? this.state.count : '9+';

        return (
            <div>
                <Badgeable
                    topLeft={this.state.isExpired && <IconExpirationBadge />}
                    topRight={<CountBadge shouldAnimate isVisible={this.state.count > 0} value={displayCount}/>}
                    bottomRight={this.state.showTooltipBadge && this.badgedWithTooltip()}
                >
                    <Avatar id={ 1 } name='Aaron Levie' />
                </Badgeable>
                <hr/>
                <Button onClick={this.toggleExpiry.bind(this)}>Toggle Expiry Icon</Button>
                <Button onClick={this.toggleTooltipButton.bind(this)}>Toggle Badge with Tooltip</Button>
                <Button onClick={this.updateCount.bind(this)}>Add New Notification Badge</Button>
            </div>
        );
    }
}

<BadgeableExample/>
```

### Elements can wrap components with event handlers

```
const BetaBadge = require('../badge/BetaBadge').default;
const IconGlobe = require('../../icons/general/IconGlobe').default;
const Tooltip = require('../tooltip/Tooltip').default;

class BadgeableExample2 extends React.Component {
    constructor() {
        super();

        this.state = {
            isExpired: false,
            showTooltipBadge: false,
        }
    }

    toggleTooltipButton() {
        this.setState({
            showTooltipBadge: !this.state.showTooltipBadge,
        });
    }

    badgedWithTooltip() {
        return (
            <Tooltip
                text="EXAMPLE: The globe indicates an external collaborator"
                position="middle-right">
                <div>
                    <IconGlobe/>
                </div>
            </Tooltip>
        );
    }

    render() {
        return (
            <div>
                <Badgeable
                    topRight={<BetaBadge />}
                    bottomRight={this.state.showTooltipBadge && this.badgedWithTooltip()}
                >
                    <Button onClick={this.toggleTooltipButton.bind(this)}>Toggle Badge with Tooltip</Button>
                </Badgeable>
                <hr/>
            </div>
        );
    }
}

<BadgeableExample2/>
```


