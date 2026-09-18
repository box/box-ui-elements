import * as React from 'react';
import { Children, Component } from 'react';

import { HotkeyContext } from './HotkeyContext';
import type { HotkeyConfig } from './HotkeyRecord';
import type HotkeyService from './HotkeyService';

export interface HotkeysProps {
    /** Single child element to render */
    children?: React.ReactNode;
    /** Array of hotkey configs, either in the specified shape, or instances of HotkeyRecord */
    configs: HotkeyConfig[];
}

class Hotkeys extends Component<HotkeysProps> {
    /* eslint-disable no-underscore-dangle */

    static contextType = HotkeyContext;

    context: HotkeyService | null;

    componentDidMount() {
        const { configs } = this.props;
        const hotkeyLayer = this.context;

        if (!hotkeyLayer) {
            throw new Error('You must instantiate a HotkeyLayer before using Hotkeys');
        }

        this._addHotkeys(configs);
    }

    componentDidUpdate(prevProps: HotkeysProps) {
        const { configs: newConfigs } = this.props;
        const { configs: prevConfigs } = prevProps;

        const additions = newConfigs.filter(config => prevConfigs.indexOf(config) === -1);
        const removals = prevConfigs.filter(config => newConfigs.indexOf(config) === -1);

        this._removeHotkeys(removals);
        this._addHotkeys(additions);
    }

    componentWillUnmount() {
        const { configs } = this.props;

        this._removeHotkeys(configs);
    }

    _addHotkeys(hotkeyConfigs: HotkeyConfig[]) {
        hotkeyConfigs.forEach(hotkeyConfig => this.context.registerHotkey(hotkeyConfig));
    }

    _removeHotkeys(hotkeyConfigs: HotkeyConfig[]) {
        if (this.context) {
            hotkeyConfigs.forEach(hotkeyConfig => this.context.deregisterHotkey(hotkeyConfig));
        }
    }

    render() {
        if (!this.props.children) {
            return null;
        }
        return Children.only(this.props.children);
    }
}

export default Hotkeys;
