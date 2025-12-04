import * as React from 'react';

import { Card, Text, InlineNotice } from '@box/blueprint-web';
import Button from '../button/Button';
import Modal from '../modal/Modal';
import ModalActions from '../modal/ModalActions';
import HotkeyLayer from './HotkeyLayer';
import HotkeyRecord from './HotkeyRecord';

export const HotkeyFeatures = () => {
    const [message, setMessage] = React.useState('Press keys to see actions');
    const [count, setCount] = React.useState(0);
    const [baseMessage, setBaseMessage] = React.useState('Base layer active');
    const [modalMessage, setModalMessage] = React.useState('Modal layer active');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [action, setAction] = React.useState('No action yet');

    const baseHotkeys = [
        // Basic single key hotkeys
        new HotkeyRecord({
            key: 'a',
            handler: () => {
                setMessage('Hotkey "a" was pressed!');
                setCount(c => c + 1);
            },
            description: 'Show a message',
            type: 'navigation',
        }),
        new HotkeyRecord({
            key: 'b',
            handler: () => {
                setMessage('Hotkey "b" was pressed!');
                setCount(c => c + 1);
            },
            description: 'Show another message',
            type: 'navigation',
        }),
        new HotkeyRecord({
            key: 'c',
            handler: () => {
                setCount(0);
                setMessage('Count reset!');
            },
            description: 'Reset counter',
            type: 'actions',
        }),
        // Navigation hotkeys
        new HotkeyRecord({
            key: 'n',
            handler: () => {
                setAction('Next item');
            },
            description: 'Go to next item',
            type: 'navigation',
        }),
        new HotkeyRecord({
            key: 'p',
            handler: () => {
                setAction('Previous item');
            },
            description: 'Go to previous item',
            type: 'navigation',
        }),
        // Action hotkeys
        new HotkeyRecord({
            key: 's',
            handler: () => {
                setAction('Save changes');
            },
            description: 'Save',
            type: 'actions',
        }),
        new HotkeyRecord({
            key: 'd',
            handler: () => {
                setAction('Delete item');
            },
            description: 'Delete',
            type: 'actions',
        }),
        // Key combinations
        new HotkeyRecord({
            key: 'ctrl+s',
            handler: () => {
                setAction('Save (Ctrl+S)');
            },
            description: 'Save document',
            type: 'actions',
        }),
        new HotkeyRecord({
            key: 'shift+a',
            handler: () => {
                setAction('Select All (Shift+A)');
            },
            description: 'Select all items',
            type: 'actions',
        }),
        new HotkeyRecord({
            key: ['ctrl+z', 'meta+z'],
            handler: () => {
                setAction('Undo (Ctrl+Z or Cmd+Z)');
            },
            description: 'Undo last action',
            type: 'actions',
        }),
        new HotkeyRecord({
            key: 'alt+n',
            handler: () => {
                setAction('New (Alt+N)');
            },
            description: 'Create new item',
            type: 'actions',
        }),
        // Hidden hotkey (no type)
        new HotkeyRecord({
            key: 'h',
            handler: () => {
                setMessage('Hidden hotkey pressed (not shown in help modal)');
            },
            description: null, // Hidden hotkey
        }),
        // Open modal
        new HotkeyRecord({
            key: 'o',
            handler: () => {
                setIsModalOpen(true);
            },
            description: 'Open modal',
            type: 'base',
        }),
        // Base layer action that will be overridden by modal
        new HotkeyRecord({
            key: 'x',
            handler: () => {
                setBaseMessage('Base hotkey "x" pressed');
            },
            description: 'Base layer action',
            type: 'base',
        }),
    ];

    const modalHotkeys = [
        new HotkeyRecord({
            key: 'x',
            handler: () => {
                setModalMessage('Modal hotkey "x" pressed (overrides base)');
            },
            description: 'Modal layer action',
            type: 'modal',
        }),
        new HotkeyRecord({
            key: 'esc',
            handler: () => {
                setIsModalOpen(false);
            },
            description: 'Close modal',
            type: 'modal',
        }),
        new HotkeyRecord({
            key: 's',
            handler: () => {
                setAction('Save from modal');
            },
            description: 'Save in modal',
            type: 'modal',
        }),
    ];

    return (
        <HotkeyLayer configs={baseHotkeys} enableHelpModal helpModalShortcut="?">
            <Card>
                <Text as="h1">Hotkey Features</Text>

                <div>
                    <Card>
                        <Text as="h2">Hotkeys</Text>
                        <Text>
                            <strong>Basic:</strong> <kbd>a</kbd> <kbd>b</kbd> <kbd>c</kbd>
                        </Text>
                        <Text>
                            <strong>Navigation:</strong> <kbd>n</kbd> <kbd>p</kbd>
                        </Text>
                        <Text>
                            <strong>Actions:</strong> <kbd>s</kbd> <kbd>d</kbd>
                        </Text>
                        <Text>
                            <strong>Combinations:</strong> <kbd>Ctrl</kbd>+<kbd>S</kbd> <kbd>Shift</kbd>+<kbd>A</kbd>{' '}
                            <kbd>Alt</kbd>+<kbd>N</kbd>
                        </Text>
                        <Text>
                            <strong>Hidden:</strong> <kbd>h</kbd> (not shown in help modal)
                        </Text>
                        <Text>
                            <strong>Modal:</strong> <kbd>o</kbd> to open, <kbd>esc</kbd> to close
                        </Text>
                        <Text>
                            <strong>Help:</strong> <kbd>?</kbd> to see all hotkeys
                        </Text>
                    </Card>

                    <Card>
                        <Text as="h2">Status</Text>
                        <Text>
                            <strong>Message:</strong> {message}
                        </Text>
                        <Text>
                            <strong>Hotkeys triggered:</strong> {count}
                        </Text>
                        <Text>
                            <strong>Last action:</strong> {action}
                        </Text>
                        <Text>
                            <strong>Base Layer:</strong> {baseMessage}
                        </Text>
                        <Text>
                            <strong>Modal Layer:</strong> {modalMessage}
                        </Text>
                    </Card>
                </div>

                <InlineNotice title="Features Demonstrated" type="info">
                    <ul>
                        <li>
                            <strong>Basic hotkeys:</strong> Single key presses (a, b, c)
                        </li>
                        <li>
                            <strong>Help modal:</strong> Press <kbd>?</kbd> to see all available hotkeys organized by
                            type
                        </li>
                        <li>
                            <strong>Multiple types:</strong> Hotkeys categorized as navigation, actions, base, modal
                        </li>
                        <li>
                            <strong>Hidden hotkeys:</strong> Press <kbd>h</kbd> - it works but won&apos;t show in help
                            modal (no type)
                        </li>
                        <li>
                            <strong>Key combinations:</strong> Modifier keys like Ctrl+S, Shift+A, Alt+N
                        </li>
                        <li>
                            <strong>Multiple bindings:</strong> Ctrl+Z (Windows/Linux) or Cmd+Z (Mac) for the same
                            action
                        </li>
                        <li>
                            <strong>Nested layers:</strong> Press <kbd>o</kbd> to open modal - it has its own hotkey
                            layer that overrides base layer hotkeys
                        </li>
                    </ul>
                </InlineNotice>
            </Card>
            {isModalOpen && (
                <HotkeyLayer configs={modalHotkeys} enableHelpModal helpModalShortcut="?">
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        title="Modal Layer (Active)"
                    >
                        <Text>This modal has its own hotkey layer that overrides the base layer.</Text>
                        <InlineNotice title="Try these in the modal:" type="warning">
                            <ul>
                                <li>
                                    Press <kbd>x</kbd> - triggers modal action (not base action)
                                </li>
                                <li>
                                    Press <kbd>s</kbd> - saves from modal context
                                </li>
                                <li>
                                    Press <kbd>esc</kbd> - closes modal
                                </li>
                                <li>
                                    Press <kbd>?</kbd> - see only modal hotkeys in help
                                </li>
                            </ul>
                            <Text>
                                Notice how base layer hotkeys (like <kbd>a</kbd>, <kbd>b</kbd>) don&apos;t work here -
                                the modal layer blocks them!
                            </Text>
                        </InlineNotice>
                        <ModalActions>
                            <Button onClick={() => setIsModalOpen(false)}>Close Modal</Button>
                        </ModalActions>
                    </Modal>
                </HotkeyLayer>
            )}
        </HotkeyLayer>
    );
};

export default {
    title: 'Components/Hotkeys',
    component: HotkeyLayer,
    parameters: {
        notes:
            'The Hotkey system allows you to register keyboard shortcut handlers. ' +
            'Press "?" to open the help modal. ' +
            'This demo shows all hotkey features: basic hotkeys, help modal, multiple types, ' +
            'hidden hotkeys, key combinations, multiple bindings, and nested layers.',
    },
};
