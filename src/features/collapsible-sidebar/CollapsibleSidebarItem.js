/**
 * @flow
 * @file CollapsibleSidebar item component that will render stylized collapsedElement or expanded depending on the expanded prop.
 * @author Box
 *
 * CollapsibleSidebar item component that will render stylized collapsedElement or expanded depending on the expanded prop.
 */
import * as React from 'react';

import Tooltip from '../../components/tooltip';

import LeftSidebarLinkCallout from '../left-sidebar/LeftSidebarLinkCallout';
import type { Callout } from '../left-sidebar/Callout';

type Props = {
    /** Callout element used in the menu. */
    callout?: Callout,

    /** Element to be shown when component is collapsed */
    collapsedElement: React.Node,

    /** Controls whether or not the sidebar is expanded on the page */
    expanded: boolean,

    /** Element to be shown when component is expanded */
    expandedElement: React.Node,

    /** Tooltip message to show for collapsed item */
    tooltipMessage?: string,
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

    const wrappedCollapsedElement = (
        <Tooltip isTabbable={false} position="middle-right" text={tooltipMessage} isDisabled={!tooltipMessage}>
            {collapsedElement}
        </Tooltip>
    );

    return expanded ? expandedElement : wrappedCollapsedElement;
}

export default CollapsibleSidebarItem;
