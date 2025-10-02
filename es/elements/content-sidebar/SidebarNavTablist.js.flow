/**
 * @flow
 * @file Content Sidebar nav tablist Component
 * @author Box
 */

import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { KEYS } from '../../constants';
import type { NavigateOptions } from './flowTypes';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../common/types/SidebarNavigation';

type Props = {
    children: React.Node,
    elementId: string,
    history?: RouterHistory,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    isOpen?: boolean,
    onNavigate?: (SyntheticEvent<>, NavigateOptions) => void,
    routerDisabled?: boolean,
};

const SidebarNavTablist = ({
    children,
    history,
    elementId,
    internalSidebarNavigation,
    internalSidebarNavigationHandler,
    isOpen,
    onNavigate,
    routerDisabled = false,
}: Props) => {
    const refs = [];
    const tablist = React.Children.map(children, child => child && child.props.sidebarView);

    const handleKeyDownWithRouter = (event: SyntheticKeyboardEvent<>): void => {
        if (!history) return;

        const currentPath = history.location.pathname.replace('/', '');
        const currentIndex = tablist.indexOf(currentPath);
        const { length } = tablist;
        let nextIndex = currentIndex;

        switch (event.key) {
            case KEYS.arrowUp:
                nextIndex = (currentIndex - 1 + length) % length;
                break;
            case KEYS.arrowDown:
                nextIndex = (currentIndex + 1) % length;
                break;
            default:
                return;
        }

        const nextTab = tablist[nextIndex];
        history.push(`/${nextTab}`);

        if (refs.length > nextIndex) {
            refs[nextIndex].focus();
        }

        event.stopPropagation();
        event.preventDefault();
    };

    const handleKeyDownWithoutRouter = (event: SyntheticKeyboardEvent<>): void => {
        if (!internalSidebarNavigationHandler) return;

        const currentTab = internalSidebarNavigation?.sidebar;
        const currentIndex = tablist.indexOf(currentTab);
        const { length } = tablist;
        let nextIndex = currentIndex;

        switch (event.key) {
            case KEYS.arrowUp:
                nextIndex = (currentIndex - 1 + length) % length;
                break;
            case KEYS.arrowDown:
                nextIndex = (currentIndex + 1) % length;
                break;
            default:
                return;
        }

        const nextTab = tablist[nextIndex];
        internalSidebarNavigationHandler({
            sidebar: nextTab,
        });

        if (refs.length > nextIndex) {
            refs[nextIndex].focus();
        }

        event.stopPropagation();
        event.preventDefault();
    };

    const handleKeyDown = routerDisabled ? handleKeyDownWithoutRouter : handleKeyDownWithRouter;

    return (
        <div
            aria-orientation="vertical"
            className="bcs-SidebarNav-main"
            role="tablist"
            tabIndex="0"
            onKeyDown={handleKeyDown}
        >
            {React.Children.map(children, tab => {
                if (!tab) {
                    return null;
                }

                return React.cloneElement(tab, {
                    elementId,
                    internalSidebarNavigation,
                    internalSidebarNavigationHandler,
                    isOpen,
                    onNavigate,
                    routerDisabled,
                    ref: ref => {
                        refs.push(ref);
                    },
                    ...tab.props,
                });
            })}
        </div>
    );
};

// Conditionally wrap with withRouter only when router is not disabled
const SidebarNavTablistWithRouter = withRouter(SidebarNavTablist);

const SidebarNavTablistWrapper = (props: Props) => {
    if (props.routerDisabled) {
        return <SidebarNavTablist {...props} />;
    }
    return <SidebarNavTablistWithRouter {...props} />;
};

export default SidebarNavTablistWrapper;
