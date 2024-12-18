import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HotkeyRecord, { HotkeyPropType } from './HotkeyRecord';
import HotkeyService from './HotkeyService';

import Hotkeys from './Hotkeys';
import HotkeyHelpModal from './HotkeyHelpModal'; // eslint-disable-line import/no-cycle
import HotkeyContext from './HotKeyContext';

import './HotkeyLayer.scss';

class HotkeyLayer extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        /** Array of hotkey configs, either in the specified shape, or instances of HotkeyRecord */
        configs: PropTypes.arrayOf(HotkeyPropType),
        /** Shortcut to trigger the help modal, if it's enabled */
        helpModalShortcut: PropTypes.string,
        enableHelpModal: PropTypes.bool,
    };

    static defaultProps = {
        helpModalShortcut: '?',
        enableHelpModal: false,
    };

    constructor(props) {
        super(props);

        this.hotkeyService = new HotkeyService();


        // need to move this inside constructor so that we can access this.hotkeyService after it's initialized
        this.state = {
            isHelpModalOpen: false,
            hotkeyLayer: this.hotkeyService,
        }
    }

    componentWillUnmount() {
        this.hotkeyService.destroyLayer();
    }

    getHotkeyConfigs() {
        const { configs = [], helpModalShortcut, enableHelpModal } = this.props;

        if (!enableHelpModal) {
            return configs;
        }

        return [
            new HotkeyRecord({
                key: helpModalShortcut,
                handler: () => this.openHelpModal(),
            }),
            ...configs,
        ];
    }

    openHelpModal = () => {
        this.setState({
            isHelpModalOpen: true,
        });
    };

    closeHelpModal = () => {
        this.setState({
            isHelpModalOpen: false,
        });
    };

    render() {
        const { children, className = '', enableHelpModal } = this.props;

        return (
            <HotkeyContext.Provider value={this.state}>
                <Hotkeys configs={this.getHotkeyConfigs()}>
                    {enableHelpModal ? (
                        <span className={`hotkey-layer ${className}`}>
                            <HotkeyHelpModal isOpen={this.state.isHelpModalOpen} onRequestClose={this.closeHelpModal} />
                            {children}
                        </span>
                    ) : (
                        children
                    )}
                </Hotkeys>
            </HotkeyContext.Provider>
        );
    }
}

export default HotkeyLayer;
