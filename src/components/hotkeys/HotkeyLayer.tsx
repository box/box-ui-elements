import * as React from 'react';
import { Component } from 'react';

import HotkeyRecord from './HotkeyRecord';
import type { HotkeyConfig } from './HotkeyRecord';
import HotkeyService from './HotkeyService';
import { HotkeyContext } from './HotkeyContext';

import Hotkeys from './Hotkeys';
import HotkeyHelpModal from './HotkeyHelpModal';

import './HotkeyLayer.scss';

export interface HotkeyLayerProps {
    /** Layer contents */
    children?: React.ReactNode;
    /** Additional CSS class name applied when the help modal is enabled */
    className?: string;
    /** Array of hotkey configs, either in the specified shape, or instances of HotkeyRecord */
    configs?: HotkeyConfig[];
    /** Whether to enable the keyboard shortcut help modal */
    enableHelpModal?: boolean;
    /** Shortcut to trigger the help modal, if it's enabled */
    helpModalShortcut?: string;
}

interface HotkeyLayerState {
    isHelpModalOpen: boolean;
}

class HotkeyLayer extends Component<HotkeyLayerProps, HotkeyLayerState> {
    static defaultProps = {
        helpModalShortcut: '?',
        enableHelpModal: false,
    };

    hotkeyService: HotkeyService;

    constructor(props: HotkeyLayerProps) {
        super(props);

        this.hotkeyService = new HotkeyService();
    }

    state = {
        isHelpModalOpen: false,
    };

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
            <HotkeyContext.Provider value={this.hotkeyService}>
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
