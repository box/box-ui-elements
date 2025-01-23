/**
 * @flow
 * @file Custom Redirect component
 * @author Box
 */

import * as React from 'react';
import { RouterContext } from './RouterContext';

class CustomRedirect extends React.Component {
    static contextType = RouterContext;

    componentDidMount() {
        const { to } = this.props;
        const { history } = this.context;
        const path = typeof to === 'string' ? to : to.pathname;
        const state = typeof to === 'string' ? undefined : to.state;
        history.replace(path, state);
    }

    render() {
        return null;
    }
}

export default CustomRedirect;
