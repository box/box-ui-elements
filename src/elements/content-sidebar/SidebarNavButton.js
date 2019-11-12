/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import { Route } from 'react-router-dom';
import NavButton from '../common/nav-button';
import Tooltip from '../../components/tooltip/Tooltip';
import './SidebarNavButton.scss';

type Props = {
    'data-resin-target'?: string,
    'data-testid'?: string,
    children: React.Node,
    elementId?: string,
    isOpen?: boolean,
    sidebarView: string,
    tooltip: React.Node,
};

const SidebarNavButton = React.forwardRef<Props, React.Ref<any>>((props: Props, ref: React.Ref<any>) => {
    const {
        'data-resin-target': dataResinTarget,
        'data-testid': dataTestId,
        children,
        elementId = '',
        isOpen,
        sidebarView,
        tooltip,
    } = props;
    const sidebarPath = `/${sidebarView}`;

    return (
        <Route path={sidebarPath}>
            {({ match }) => {
                const isMatch = !!match;
                const isActive = () => isMatch && !!isOpen;
                const isActiveValue = isActive();
                const isToggle = isMatch && match.isExact;
                const sidebarState = { open: isToggle ? !isOpen : true };
                const id = `${elementId}${elementId === '' ? '' : '_'}${sidebarView}`;

                return (
                    <Tooltip position="middle-left" text={tooltip} isTabbable={false}>
                        <NavButton
                            activeClassName="bdl-is-selected"
                            aria-selected={isActiveValue}
                            aria-controls={`${id}-content`}
                            className="bcs-NavButton"
                            data-resin-target={dataResinTarget}
                            data-testid={dataTestId}
                            getDOMRef={ref}
                            id={id}
                            isActive={isActive}
                            replace={isToggle}
                            role="tab"
                            tabIndex={isActiveValue ? '0' : '-1'}
                            to={{
                                pathname: sidebarPath,
                                state: sidebarState,
                            }}
                            type="button"
                        >
                            {children}
                        </NavButton>
                    </Tooltip>
                );
            }}
        </Route>
    );
});

export default SidebarNavButton;
