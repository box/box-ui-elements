import * as React from 'react';
import PropTypes from 'prop-types';
import { HotkeyPropType } from './HotkeyRecord';
import { HotkeyConsumer } from './HotkeyContext';

const { Children } = React;

class Hotkeys extends React.Component {
    /* eslint-disable no-underscore-dangle */

    static propTypes = {
        children: PropTypes.node,
        /** Array of hotkey configs, either in the specified shape, or instances of HotkeyRecord */
        configs: PropTypes.arrayOf(HotkeyPropType).isRequired,
    };

    // We handle all hotkey registration in render() through the HotkeyConsumer
    // This ensures we always have access to the hotkeyLayer context

    componentDidMount() {} // Intentionally empty - handled in render

    componentDidUpdate(prevProps) {
        const { configs: newConfigs } = this.props;
        const { configs: prevConfigs } = prevProps;

        // Handle hotkey updates immediately if we have a layer
        if (!this.hotkeyLayer || !this.hotkeyLayer.registerHotkey || !this.hotkeyLayer.deregisterHotkey) {
            throw new Error('You must instantiate a HotkeyLayer before using Hotkeys');
        }

        // First remove any hotkeys that are no longer in the config
        const removals = prevConfigs.filter(
            prevConfig =>
                !newConfigs.some(
                    newConfig =>
                        (Array.isArray(prevConfig.key) ? prevConfig.key.join('+') : prevConfig.key) ===
                        (Array.isArray(newConfig.key) ? newConfig.key.join('+') : newConfig.key),
                ),
        );

        // Then add any new hotkeys
        const additions = newConfigs.filter(
            newConfig =>
                !prevConfigs.some(
                    prevConfig =>
                        (Array.isArray(newConfig.key) ? newConfig.key.join('+') : newConfig.key) ===
                        (Array.isArray(prevConfig.key) ? prevConfig.key.join('+') : prevConfig.key),
                ),
        );

        if (removals.length) {
            this._removeHotkeys(removals);
        }
        if (additions.length) {
            this._addHotkeys(additions);
        }
    }

    componentWillUnmount() {
        // Clean up any remaining hotkeys
        const { configs } = this.props;
        if (this.hotkeyLayer) {
            this._removeHotkeys(configs);
            this.hotkeyLayer = null;
        }
    }

    _addHotkeys(hotkeyConfigs) {
        if (!this.hotkeyLayer) {
            throw new Error('You must instantiate a HotkeyLayer before using Hotkeys');
        }
        hotkeyConfigs.forEach(hotkeyConfig => this.hotkeyLayer.registerHotkey(hotkeyConfig));
    }

    _removeHotkeys(hotkeyConfigs) {
        if (!this.hotkeyLayer) {
            return;
        }
        hotkeyConfigs.forEach(hotkeyConfig => this.hotkeyLayer.deregisterHotkey(hotkeyConfig));
    }

    render() {
        const { children } = this.props;
        if (!children) {
            return null;
        }

        return (
            <HotkeyConsumer>
                {hotkeyLayer => {
                    if (
                        !hotkeyLayer ||
                        !hotkeyLayer.getActiveTypes ||
                        !hotkeyLayer.registerHotkey ||
                        !hotkeyLayer.deregisterHotkey
                    ) {
                        throw new Error('You must instantiate a HotkeyLayer before using Hotkeys');
                    }

                    // Store reference to hotkeyLayer and register initial hotkeys
                    if (!this.hotkeyLayer) {
                        this.hotkeyLayer = hotkeyLayer;
                        this._addHotkeys(this.props.configs);
                    }

                    return Children.only(children);
                }}
            </HotkeyConsumer>
        );
    }
}

export default Hotkeys;
