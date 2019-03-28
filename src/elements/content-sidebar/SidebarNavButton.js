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
    children: React.Node,
    interactionTarget: string,
    onNavigate?: (SyntheticEvent<>, NavigateOptions) => void,
    sidebarView: string,
    tooltip: React.Node,
};

const SidebarNavButton = ({ children, interactionTarget, onNavigate, sidebarView, tooltip }: Props) => {
    const sidebarPath = `/${sidebarView}`;

    return (
        <Tooltip position="middle-left" text={tooltip}>
            <Route path={sidebarPath}>
                {({ match }) => {
                    const isToggle = !!match && match.isExact;

                    return (
                        <NavButton
                            activeClassName="bcs-is-selected"
                            className="bcs-NavButton"
                            data-resin-target={interactionTarget}
                            data-testid={interactionTarget}
                            onClick={event => {
                                if (onNavigate) {
                                    onNavigate(event, { isToggle });
                                }
                            }}
                            replace={isToggle}
                            to={sidebarPath}
                            type="button"
                        >
                            {children}
                        </NavButton>
                    );
                }}
            </Route>
        </Tooltip>
    );
};

export default SidebarNavButton;
