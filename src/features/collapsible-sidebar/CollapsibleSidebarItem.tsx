/**
 * A sidebar component that supports collapsed/expanded state for responsive sizing.
 * This component should NOT contain any reference to EUA specific patterns like Immutables and redux containers.
 */
import * as React from 'react';

import Tooltip, { TooltipPosition } from '../../components/tooltip';

import { Callout } from '../left-sidebar/Callout';
// eslint-disable-next-line import/no-named-as-default-member, import/no-named-as-default
import LeftSidebarLinkCallout from '../left-sidebar/LeftSidebarLinkCallout';

type Props = {
    /** Callout element used in the menu. */
    callout?: Callout;

    /** Element to be shown when component is collapsed */
    collapsedElement: JSX.Element;

    /** Controls whether or not the sidebar is expanded on the page */
    expanded: boolean;

    /** Element to be shown when component is expanded */
    expandedElement: JSX.Element;

    /** Tooltip message to show for collapsed item */
    tooltipMessage?: string;
};

function CollapsibleSidebarItem(props: Props) {
    const { callout, collapsedElement, expanded, expandedElement, tooltipMessage } = props;

    if (callout) {
        const calloutChildren = expanded ? expandedElement : collapsedElement;
        return (
            <LeftSidebarLinkCallout
                attachmentPosition="bottom left"
                callout={callout}
                targetAttachmentPosition="bottom right"
            >
                {calloutChildren}
            </LeftSidebarLinkCallout>
        );
    }

    let wrappedCollapsedElement = collapsedElement;

    if (tooltipMessage) {
        wrappedCollapsedElement = (
            <Tooltip isTabbable={false} position={TooltipPosition.MIDDLE_RIGHT} text={tooltipMessage}>
                {collapsedElement}
            </Tooltip>
        );
    }

    return expanded ? expandedElement : wrappedCollapsedElement;
}

export default CollapsibleSidebarItem;
