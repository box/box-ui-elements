import * as React from 'react';
import { HotkeyContext } from '../HotkeyContext';

/**
 * Creates a test wrapper component that provides HotkeyContext and manages state
 */
export const createContextTestWrapper = ({ contextValue, renderChild, initialState = {} }) => {
    class TestWrapper extends React.Component {
        constructor(props) {
            super(props);
            this.state = initialState;
        }

        render() {
            return (
                <HotkeyContext.Provider value={contextValue}>
                    {renderChild(this.state, this.setState.bind(this))}
                </HotkeyContext.Provider>
            );
        }
    }
    return TestWrapper;
};
