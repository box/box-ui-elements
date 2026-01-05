/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import { Route } from 'react-router-dom';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { Button, Tooltip } from '@box/blueprint-web';
import { isLeftClick } from '../../utils/dom';
import type {
    InternalSidebarNavigation,
    InternalSidebarNavigationHandler,
    ViewTypeValues,
} from '../common/types/SidebarNavigation';
import './SidebarNavButton.scss';

type Props = {
    'data-resin-target'?: string,
    'data-testid'?: string,
    children: React.Element<any>,
    elementId?: string,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    isDisabled?: boolean,
    isOpen?: boolean,
    onClick?: (sidebarView: ViewTypeValues) => void,
    routerDisabled?: boolean,
    sidebarView: ViewTypeValues,
    tooltip: React.Node,
};

const SidebarNavButton = React.forwardRef<Props, HTMLButtonElement>((props: Props, ref) => {
    const {
        'data-resin-target': dataResinTarget,
        'data-testid': dataTestId,
        children,
        elementId = '',
        internalSidebarNavigation,
        internalSidebarNavigationHandler,
        isDisabled,
        isOpen,
        onClick = noop,
        routerDisabled = false,
        sidebarView,
        tooltip,
    } = props;
    const ariaLabel = typeof tooltip === 'string' ? tooltip : undefined;
    const sidebarPath = `/${sidebarView}`;
    const id = `${elementId}${elementId === '' ? '' : '_'}${sidebarView}`;

    if (routerDisabled) {
        // Mimic router behavior using internalSidebarNavigation
        const isMatch = !!internalSidebarNavigation && internalSidebarNavigation.sidebar === sidebarView;
        const isActiveValue = isMatch && !!isOpen;

        // Mimic isExactMatch: true when no extra navigation parameters are present
        const hasExtraParams =
            internalSidebarNavigation &&
            (internalSidebarNavigation.versionId ||
                internalSidebarNavigation.activeFeedEntryType ||
                internalSidebarNavigation.activeFeedEntryId ||
                internalSidebarNavigation.fileVersionId);
        const isExactMatch = isMatch && !hasExtraParams;

        const handleNavButtonClick = event => {
            onClick(sidebarView);

            // Mimic router navigation behavior
            if (internalSidebarNavigationHandler && !event.defaultPrevented && isLeftClick(event)) {
                const replace = isExactMatch;
                internalSidebarNavigationHandler(
                    {
                        sidebar: sidebarView,
                        open: true,
                    },
                    replace,
                );
            }
        };

        // Clone children and pass isActive prop (only for React components, not DOM elements)
        const childrenWithProps =
            typeof children.type === 'string' ? children : React.cloneElement(children, { isActive: isActiveValue });

        return (
            <Tooltip content={tooltip} side="left">
                <Button
                    accessibleWhenDisabled={true}
                    aria-controls={`${id}-content`}
                    aria-label={ariaLabel}
                    aria-selected={isActiveValue}
                    className={classNames('bcs-NavButton', {
                        'bcs-is-selected': isActiveValue,
                        'bdl-is-disabled': isDisabled,
                    })}
                    data-resin-target={dataResinTarget}
                    data-testid={dataTestId}
                    ref={ref}
                    id={id}
                    disabled={isDisabled}
                    onClick={handleNavButtonClick}
                    role="tab"
                    tabIndex={isActiveValue ? 0 : -1}
                    type="button"
                    variant="tertiary"
                >
                    {childrenWithProps}
                </Button>
            </Tooltip>
        );
    }

    return (
        <Route path={sidebarPath}>
            {({ match, history }) => {
                const isMatch = !!match;
                const isActiveValue = isMatch && !!isOpen;
                const isExactMatch = isMatch && match.isExact;

                const handleNavButtonClick = event => {
                    onClick(sidebarView);

                    if (!event.defaultPrevented && isLeftClick(event)) {
                        const method = isExactMatch ? history.replace : history.push;
                        method({
                            pathname: sidebarPath,
                            state: { open: true },
                        });
                    }
                };

                // Clone children and pass isActive prop (only for React components, not DOM elements)
                const childrenWithProps =
                    typeof children.type === 'string'
                        ? children
                        : React.cloneElement(children, { isActive: isActiveValue });

                return (
                    <Tooltip content={tooltip} side="left">
                        <Button
                            accessibleWhenDisabled={true}
                            aria-controls={`${id}-content`}
                            aria-label={ariaLabel}
                            aria-selected={isActiveValue}
                            className={classNames('bcs-NavButton', {
                                'bcs-is-selected': isActiveValue,
                                'bdl-is-disabled': isDisabled,
                            })}
                            data-resin-target={dataResinTarget}
                            data-testid={dataTestId}
                            ref={ref}
                            id={id}
                            disabled={isDisabled}
                            onClick={handleNavButtonClick}
                            role="tab"
                            tabIndex={isActiveValue ? 0 : -1}
                            type="button"
                            variant="tertiary"
                        >
                            {childrenWithProps}
                        </Button>
                    </Tooltip>
                );
            }}
        </Route>
    );
});

export default SidebarNavButton;
