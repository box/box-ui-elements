import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { KEYS } from '../../constants';
import type { NavigateOptions } from './flowTypes';

interface Props {
    children: React.ReactNode;
    elementId: string;
    isOpen?: boolean;
    onNavigate?: (event: React.SyntheticEvent<HTMLElement>, options: NavigateOptions) => void;
}

const SidebarNavTablist = ({ children, elementId, isOpen, onNavigate }: Props): React.ReactElement => {
    const history = useHistory();
    const refs: Array<HTMLElement | null> = [];
    const tablist = React.Children.map(children, child => {
        if (!child || !React.isValidElement(child)) return null;
        return `/${child.props.sidebarView}`;
    });

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        const currentIndex = tablist ? tablist.indexOf(history.location.pathname) : -1;
        const length = tablist ? tablist.length : 0;
        let nextIndex = currentIndex;

        switch (event.key) {
            case KEYS.arrowUp:
                nextIndex = (currentIndex - 1 + length) % length;

                if (tablist) {
                    const path = tablist[nextIndex];
                    if (path) {
                        history.push({ pathname: path });
                    }
                    if (refs.length > 0 && refs[nextIndex]) {
                        refs[nextIndex]?.focus();
                    }
                }

                event.stopPropagation();
                event.preventDefault();
                break;
            case KEYS.arrowDown:
                nextIndex = (currentIndex + 1) % length;

                if (tablist) {
                    const path = tablist[nextIndex];
                    if (path) {
                        history.push({ pathname: path });
                    }
                    if (refs.length > 0 && refs[nextIndex]) {
                        refs[nextIndex]?.focus();
                    }
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
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {React.Children.map(children, tab => {
                if (!tab) {
                    return null;
                }

                if (!React.isValidElement(tab)) return null;
                return React.cloneElement(tab, {
                    elementId,
                    isOpen,
                    onNavigate,
                    ref: (ref: HTMLElement | null) => {
                        refs.push(ref);
                    },
                    ...tab.props,
                });
            })}
        </div>
    );
};

export default SidebarNavTablist;
