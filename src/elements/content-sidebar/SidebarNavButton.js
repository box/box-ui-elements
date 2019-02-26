/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import PlainButton from '../../components/plain-button';
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
    const linkPath = `/${sidebarView}`;

    return (
        <Tooltip position="middle-left" text={tooltip}>
            <Route path={linkPath}>
                {({ history, location, match }) => (
                    <PlainButton
                        className={classNames('bcs-nav-btn', {
                            'bcs-nav-btn-is-selected': match,
                        })}
                        data-resin-target={interactionTarget}
                        data-testid={interactionTarget}
                        onClick={event => {
                            const isToggle = location.pathname === linkPath;
                            const method = isToggle ? history.replace : history.push;

                            if (onNavigate) {
                                onNavigate(event, { isToggle });
                            }

                            method({ pathname: linkPath });
                        }}
                        type="button"
                    >
                        {children}
                    </PlainButton>
                )}
            </Route>
        </Tooltip>
    );
};

export default SidebarNavButton;
