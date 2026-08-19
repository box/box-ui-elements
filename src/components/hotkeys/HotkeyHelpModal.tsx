import * as React from 'react';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// @ts-ignore flow import
import { ModalActions } from '../modal';
import Button, { ButtonType } from '../button';
import PlainButton from '../plain-button';
import DropdownMenu, { MenuToggle } from '../dropdown-menu';
// @ts-ignore flow import
import { Menu, MenuItem } from '../menu';
import { HotkeyContext } from './HotkeyContext';
import HotkeyFriendlyModal from './HotkeyFriendlyModal';
import type { HotkeyConfig } from './HotkeyRecord';
import type HotkeyService from './HotkeyService';

// @ts-ignore flow import
import commonMessages from '../../common/messages';
import messages from './messages';

import './HotkeyHelpModal.scss';

export interface HotkeyHelpModalProps {
    /** Whether the help modal is open */
    isOpen?: boolean;
    /** Called when the modal requests to close */
    onRequestClose: Function;
}

interface HotkeyHelpModalState {
    currentType: string | null;
}

const specialCharacters: { [key: string]: React.ReactNode } = {
    backspace: '\u232b',
    down: '\u2193',
    left: '\u2190',
    meta: '\u2318',
    right: '\u2192',
    up: '\u2191',
    enter: <FormattedMessage {...messages.enterKey} />,
    spacebar: <FormattedMessage {...messages.spacebarKey} />,
    shift: '\u21e7',
    ctrl: <FormattedMessage {...messages.ctrlKey} />,
    alt: <FormattedMessage {...messages.altKey} />,
    esc: <FormattedMessage {...messages.escKey} />,
};

class HotkeyHelpModal extends Component<HotkeyHelpModalProps, HotkeyHelpModalState> {
    static contextType = HotkeyContext;

    context: HotkeyService | null;

    hotkeys: { [type: string]: HotkeyConfig[] };

    types: string[];

    constructor(props: HotkeyHelpModalProps) {
        super(props);

        this.hotkeys = {};
        this.types = [];
        this.state = {
            currentType: null,
        };
    }

    componentDidMount() {
        const hotkeyLayer = this.context;
        if (hotkeyLayer) {
            this.hotkeys = hotkeyLayer.getActiveHotkeys();
            this.types = hotkeyLayer.getActiveTypes();
            this.setState({
                currentType: this.types.length ? this.types[0] : null,
            });
        }
    }

    componentDidUpdate({ isOpen: prevIsOpen }: HotkeyHelpModalProps, { currentType: prevType }: HotkeyHelpModalState) {
        const { isOpen } = this.props;
        const hotkeyLayer = this.context;

        if (!isOpen || !hotkeyLayer) {
            return;
        }

        // modal is being opened; refresh hotkeys
        if (!prevIsOpen && isOpen) {
            this.hotkeys = hotkeyLayer.getActiveHotkeys();
            this.types = hotkeyLayer.getActiveTypes();
        }

        if (!prevType && this.types.length) {
            this.setState({
                currentType: this.types[0],
            });
        }
    }

    /**
     * Converts a "raw" hotkey to translated JSX version
     */
    prettyPrintHotkey = (hotkeyConfig: HotkeyConfig) => {
        const hotkeys = Array.isArray(hotkeyConfig.key) ? hotkeyConfig.key : [hotkeyConfig.key];

        const prettyHotkeys = hotkeys
            .map(hotkey =>
                hotkey.split(' ').reduce((prettyHotkey: React.ReactNode, combo, i) => {
                    // Convert a "raw" combo to a "pretty" combo:
                    // e.g. "shift+g" => [ <kbd>Shift</kbd>, '+', <kbd>G</kbd> ]
                    const prettyCombo = combo
                        .split('+')
                        .map(key => {
                            // Convert special key characters into their respective icons or translated components:
                            // e.g. "shift" => "Shift", "meta" => "⌘"
                            if (key in specialCharacters) {
                                return specialCharacters[key];
                            }
                            // If it's not a special character, just return the uppercased key:
                            // e.g. "g" => "G"
                            return key.length === 1 ? key.toUpperCase() : key;
                        })
                        .map((key, j) => <kbd key={j}>{key}</kbd>);
                    // If this hotkey is a sequence of keys, return a translated message to combine them:
                    // e.g. "Shift+G Shift+A" => "Shift+G then Shift+A"
                    return i === 0 ? (
                        prettyCombo
                    ) : (
                        <FormattedMessage
                            values={{
                                key1: <span>{prettyHotkey}</span>,
                                key2: <span>{prettyCombo}</span>,
                            }}
                            {...messages.hotkeySequence}
                        />
                    );
                }, [] as React.ReactNode),
            )
            .reduce(
                (finalHotkey: React.ReactNode[], hotkey, i) =>
                    // For shortcuts with multiple hotkeys, separate each hotkey with a "/" joiner:
                    // e.g. "Cmd+S Ctrl+S" => "Cmd+S / Ctrl+S"
                    i === 0 ? [hotkey] : [...finalHotkey, ' / ', hotkey],
                [] as React.ReactNode[],
            ) as React.ReactNode[];

        return prettyHotkeys.map((element, i) => <span key={i}>{element}</span>);
    };

    renderDropdownMenu() {
        const { currentType } = this.state;

        if (!currentType) {
            return null;
        }

        return (
            <div className="hotkey-dropdown">
                <DropdownMenu>
                    <PlainButton className="lnk" type={ButtonType.BUTTON}>
                        <MenuToggle>{currentType}</MenuToggle>
                    </PlainButton>
                    <Menu>
                        {this.types.map((hotkeyType, i) => (
                            <MenuItem key={i} onClick={() => this.setState({ currentType: hotkeyType })}>
                                {hotkeyType}
                            </MenuItem>
                        ))}
                    </Menu>
                </DropdownMenu>
            </div>
        );
    }

    renderHotkey = (hotkey: HotkeyConfig, i: number) => (
        <li key={i} className="hotkey-item">
            <div className="hotkey-description">{hotkey.description}</div>
            <div className="hotkey-key">{this.prettyPrintHotkey(hotkey)}</div>
        </li>
    );

    renderHotkeyList() {
        const { currentType } = this.state;

        if (!currentType) {
            return null;
        }

        const hotkeys = this.hotkeys[currentType];

        return <ul className="hotkey-list">{hotkeys.map(this.renderHotkey)}</ul>;
    }

    render() {
        const { isOpen, onRequestClose } = this.props;
        const { currentType } = this.state;

        if (!currentType) {
            return null;
        }

        return (
            <HotkeyFriendlyModal
                className="hotkey-modal"
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                title={<FormattedMessage {...messages.hotkeyModalTitle} />}
            >
                {this.renderDropdownMenu()}
                {this.renderHotkeyList()}
                <ModalActions>
                    <Button onClick={onRequestClose}>
                        <FormattedMessage {...commonMessages.cancel} />
                    </Button>
                </ModalActions>
            </HotkeyFriendlyModal>
        );
    }
}

export default HotkeyHelpModal;
