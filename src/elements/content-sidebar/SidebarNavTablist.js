/**
 * @flow
 * @file Content Sidebar nav tablist Component
 * @author Box
 */

import * as React from 'react';
import { RouterHistory } from '../common/routing/flowTypes';
import withRouter from '../common/routing/withRouter';
import { KEYS } from '../../constants';
import { NavigateOptions } from './flowTypes';

type Props = {
    children: React.Node,
    elementId: string,
    history: RouterHistory,
    isOpen?: boolean,
    onNavigate?: (SyntheticEvent<>, NavigateOptions) => void,
};

const SidebarNavTablist = ({ children, history, elementId, isOpen, onNavigate }: Props) => {
    const refs = [];
    const tablist = React.Children.map(children, child => child && `/${child.props.sidebarView}`);
    const handleKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const currentIndex = tablist.indexOf(history.location.pathname);
        const { length } = tablist;
        let nextIndex = currentIndex;
        switch (event.key) {
            case KEYS.arrowUp:
                nextIndex = (currentIndex - 1 + length) % length;

                history.push(tablist[nextIndex]);
                if (refs.length > 0) {
                    refs[nextIndex].focus();
                }

                event.stopPropagation();
                event.preventDefault();
                break;
            case KEYS.arrowDown:
                nextIndex = (currentIndex + 1) % length;

                history.push(tablist[nextIndex]);
                if (refs.length > 0) {
                    refs[nextIndex].focus();
                }

                event.stopPropagation();
                event.preventDefault();
                break;
            default:
                break;
        }
    };

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
                    isOpen,
                    onNavigate,
                    ref: ref => {
                        refs.push(ref);
                    },
                    ...tab.props,
                });
            })}
        </div>
    );
};

export default withRouter(SidebarNavTablist);
