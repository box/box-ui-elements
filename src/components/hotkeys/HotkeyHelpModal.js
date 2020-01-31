import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import commonMessages from '../../common/messages';
import { ModalActions } from '../modal';
import Button from '../button';
import PlainButton from '../plain-button';
import DropdownMenu, { MenuToggle } from '../dropdown-menu';
import { Menu, MenuItem } from '../menu';

import HotkeyFriendlyModal from './HotkeyFriendlyModal'; // eslint-disable-line import/no-cycle
import messages from './messages';

import './HotkeyHelpModal.scss';

const specialCharacters = {
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

class HotkeyHelpModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        onRequestClose: PropTypes.func.isRequired,
    };

    static contextTypes = {
        hotkeyLayer: PropTypes.object,
    };

    constructor(props, context) {
        super(props);

        this.hotkeys = context.hotkeyLayer.getActiveHotkeys();
        this.types = context.hotkeyLayer.getActiveTypes();
        this.state = {
            currentType: this.types.length ? this.types[0] : null,
        };
    }

    componentDidUpdate({ isOpen: prevIsOpen }, { currentType: prevType }) {
        const { isOpen } = this.props;

        if (!isOpen) {
            return;
        }

        // modal is being opened; refresh hotkeys
        if (!prevIsOpen && isOpen) {
            this.hotkeys = this.context.hotkeyLayer.getActiveHotkeys();
            this.types = this.context.hotkeyLayer.getActiveTypes();
        }

        if (!prevType) {
            this.setState({
                currentType: this.types.length ? this.types[0] : null,
            });
        }
    }

    /**
     * Converts a "raw" hotkey to translated JSX version
     */
    prettyPrintHotkey = hotkeyConfig => {
        const hotkeys = Array.isArray(hotkeyConfig.key) ? hotkeyConfig.key : [hotkeyConfig.key];

        return hotkeys
            .map(hotkey =>
                hotkey.split(' ').reduce((prettyHotkey, combo, i) => {
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
                }, []),
            )
            .reduce(
                (finalHotkey, hotkey, i) =>
                    // For shortcuts with multiple hotkeys, separate each hotkey with a "/" joiner:
                    // e.g. "Cmd+S Ctrl+S" => "Cmd+S / Ctrl+S"
                    i === 0 ? [hotkey] : [...finalHotkey, ' / ', hotkey],
                [],
            )
            .map((element, i) => <span key={i}>{element}</span>);
    };

    renderDropdownMenu() {
        const { currentType } = this.state;

        if (!currentType) {
            return null;
        }

        return (
            <div className="hotkey-dropdown">
                <DropdownMenu>
                    <PlainButton className="lnk" type="button">
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

    renderHotkey = (hotkey, i) => (
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
