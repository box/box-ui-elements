import * as React from 'react';

/**
 * Provides a default DOM element for portaled UI (Tooltip, Flyout, Portal/Modal)
 * to render into, instead of document.body.
 *
 * Federated consumers that scope their CSS under a root element (e.g. a Module
 * Federation remote embedded in a host document) can wrap their subtree in this
 * provider so portaled content mounts inside that root and picks up the scoped
 * styles, rather than escaping to document.body in the shared host document.
 *
 * A null value (the default) preserves the historical document.body behavior.
 * Components consuming this context must still treat an explicit prop as taking
 * precedence over the context value.
 */
const PortalContainerContext = React.createContext<HTMLElement | null>(null);

PortalContainerContext.displayName = 'PortalContainerContext';

export default PortalContainerContext;
