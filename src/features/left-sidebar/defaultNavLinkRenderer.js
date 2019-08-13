// @flow
import * as React from 'react';
import LeftSidebarLink from './LeftSidebarLink';

import type { Callout } from './Callout';

type Props = {
    callout?: Callout,
    className?: string,
    customTheme?: Object,
    htmlAttributes?: Object,
    icon?: ?React.Element<any>,
    isScrolling?: boolean,
    message: string,
    newItemBadge?: React.Element<any> | null,
    onClickRemove?: Function,
    removeButtonHtmlAttributes?: Object,
    routerLink?: React.ComponentType<any>,
    routerProps?: Object,
    selected?: boolean,
    showTooltip?: boolean,
};

function defaultNavLinkRenderer(props: Props): React.Node {
    const {
        callout,
        className,
        customTheme,
        htmlAttributes,
        icon,
        isScrolling,
        message,
        newItemBadge,
        onClickRemove,
        removeButtonHtmlAttributes,
        routerLink,
        routerProps,
        selected,
        showTooltip,
    } = props;

    return (
        <LeftSidebarLink
            callout={callout}
            className={className}
            customTheme={customTheme}
            onClickRemove={onClickRemove}
            htmlAttributes={htmlAttributes}
            icon={icon}
            isScrolling={isScrolling}
            message={message}
            newItemBadge={newItemBadge}
            removeButtonHtmlAttributes={removeButtonHtmlAttributes}
            routerLink={routerLink}
            routerProps={routerProps}
            selected={selected}
            showTooltip={showTooltip}
        />
    );
}

export default defaultNavLinkRenderer;
