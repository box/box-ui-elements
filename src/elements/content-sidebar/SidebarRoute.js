import * as React from 'react';
import noop from 'lodash';
import { Redirect, Route } from 'react-router-dom';

const SidebarRoute = ({ children, enabled, pathFallback, render = noop, ...rest }) => (
    <Route
        exact
        render={({ ...props }) => {
            return enabled ? render(props) : <Redirect to={pathFallback} />;
        }}
        {...rest}
    />
);

export default SidebarRoute;
