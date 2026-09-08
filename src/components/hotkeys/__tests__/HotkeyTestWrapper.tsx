import * as React from 'react';

import { HotkeyContext } from '../HotkeyContext';
import type HotkeyService from '../HotkeyService';

interface HotkeyTestWrapperProps<TState extends object = Record<string, unknown>> {
    /** Value provided to HotkeyContext */
    contextValue?: HotkeyService | null;
    /** Initial component state used by renderChild */
    initialState?: TState;
    /** Render prop that receives state and setState for update tests */
    renderChild: (
        state: TState,
        setState: React.Component<HotkeyTestWrapperProps<TState>, TState>['setState'],
    ) => React.ReactNode;
}

/**
 * Test wrapper component for hotkey-related tests
 * Manages state to test componentDidUpdate behavior
 */
export class HotkeyTestWrapper<TState extends object = Record<string, unknown>> extends React.Component<
    HotkeyTestWrapperProps<TState>,
    TState
> {
    constructor(props: HotkeyTestWrapperProps<TState>) {
        super(props);
        this.state = (props.initialState || {}) as TState;
    }

    render() {
        const { contextValue, renderChild } = this.props;
        return (
            <HotkeyContext.Provider value={contextValue ?? null}>
                {renderChild(this.state, this.setState.bind(this))}
            </HotkeyContext.Provider>
        );
    }
}
