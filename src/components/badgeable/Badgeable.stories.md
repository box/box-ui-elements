Generic wrapper component for adding badges to other containers. Each corner can take in an element that
renders the badge or icon, or other types of components. Positioning can be fine-tuned with style overrides
if necessary, or by wrapping the node with a `className`.

Also allows for tooltip components to wrap the added badges.

**Note**: remember to wrap any non-block components with a block element if you add it to a Tooltip, so that positioning can be calculated.

Example: you can badge one of our avatar icons, and use state to change which badges are visible.
