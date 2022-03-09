import * as React from 'react';

import Badgeable from './Badgeable';
import Avatar from '../avatar/Avatar';
import BetaBadge from '../badge/BetaBadge';
import Button from '../button';
import CountBadge from '../count-badge/CountBadge';
import IconExpirationBadge from '../../icons/general/IconExpirationBadge';
import IconGlobe from '../../icons/general/IconGlobe';
import Tooltip, { TooltipPosition } from '../tooltip/Tooltip';
import notes from './Badgeable.stories.md';

export const BasicExample = () => {
    const [isExpired, setIsExpired] = React.useState(false);
    const [showTooltipBadge, setShowTooltipBadge] = React.useState(false);
    const [count, setCount] = React.useState(0);

    const toggleExpiry = () => setIsExpired(!isExpired);

    const toggleTooltipButton = () => setShowTooltipBadge(!showTooltipBadge);

    const badgedWithTooltip = () => (
        <Tooltip text="Here, we add a tooltip to this badge as an example" position={TooltipPosition.MIDDLE_RIGHT}>
            <div>
                <IconGlobe />
            </div>
        </Tooltip>
    );

    function updateCount() {
        setCount(count + 1);
    }

    const displayCount = count < 10 ? count : '9+';

    return (
        <div>
            <Badgeable
                topLeft={isExpired && <IconExpirationBadge />}
                topRight={<CountBadge shouldAnimate isVisible={count > 0} value={displayCount} />}
                bottomRight={showTooltipBadge && badgedWithTooltip()}
            >
                <Avatar id={1} name="Aaron Levie" />
            </Badgeable>
            <hr />
            <Button onClick={toggleExpiry}>Toggle Expiry Icon</Button>
            <Button onClick={toggleTooltipButton}>Toggle Badge with Tooltip</Button>
            <Button onClick={updateCount}>Add New Notification Badge</Button>
        </div>
    );
};

export const WithEventHandler = () => {
    const [showTooltipBadge, setShowTooltipBadge] = React.useState(false);

    const toggleTooltipButton = () => setShowTooltipBadge(!showTooltipBadge);

    const badgedWithTooltip = () => (
        <Tooltip text="EXAMPLE: The globe indicates an external collaborator" position={TooltipPosition.MIDDLE_RIGHT}>
            <div>
                <IconGlobe />
            </div>
        </Tooltip>
    );

    return (
        <div>
            <Badgeable topRight={<BetaBadge />} bottomRight={showTooltipBadge && badgedWithTooltip()}>
                <Button onClick={toggleTooltipButton}>Toggle Badge with Tooltip</Button>
            </Badgeable>
            <hr />
        </div>
    );
};

export default {
    title: 'Components|Badges/Badgeable',
    component: Badgeable,
    parameters: {
        notes,
    },
};
