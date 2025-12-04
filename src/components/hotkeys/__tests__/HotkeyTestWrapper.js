import * as React from 'react';
import { HotkeyContext } from '../HotkeyContext';

/**
 * Test wrapper component for hotkey-related tests
 * Manages state to test componentDidUpdate behavior
 */
export class HotkeyTestWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.initialState || {};
    }

    render() {
        const { contextValue, renderChild } = this.props;
        return (
            <HotkeyContext.Provider value={contextValue}>
                {renderChild(this.state, this.setState.bind(this))}
            </HotkeyContext.Provider>
        );
    }
}
