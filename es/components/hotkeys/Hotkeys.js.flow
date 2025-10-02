import { Children, Component } from 'react';
import PropTypes from 'prop-types';

import { HotkeyPropType } from './HotkeyRecord';

class Hotkeys extends Component {
    /* eslint-disable no-underscore-dangle */

    static propTypes = {
        children: PropTypes.node,
        /** Array of hotkey configs, either in the specified shape, or instances of HotkeyRecord */
        configs: PropTypes.arrayOf(HotkeyPropType).isRequired,
    };

    static contextTypes = {
        hotkeyLayer: PropTypes.object,
    };

    componentDidMount() {
        const { configs } = this.props;

        if (!this.context.hotkeyLayer) {
            throw new Error('You must instantiate a HotkeyLayer before using Hotkeys');
        }

        this._addHotkeys(configs);
    }

    componentDidUpdate(prevProps) {
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

    _addHotkeys(hotkeyConfigs) {
        hotkeyConfigs.forEach(hotkeyConfig => this.context.hotkeyLayer.registerHotkey(hotkeyConfig));
    }

    _removeHotkeys(hotkeyConfigs) {
        hotkeyConfigs.forEach(hotkeyConfig => this.context.hotkeyLayer.deregisterHotkey(hotkeyConfig));
    }

    render() {
        if (!this.props.children) {
            return null;
        }
        return Children.only(this.props.children);
    }
}

export default Hotkeys;
