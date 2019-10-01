import React from 'react';
import sinon from 'sinon';

import HotkeyRecord from '../HotkeyRecord';
import HotkeyHelpModal from '../HotkeyHelpModal';

const sandbox = sinon.sandbox.create();

describe('components/hotkeys/components/HotkeyHelpModal', () => {
    let HotkeyServiceMock;

    const getWrapper = (props = {}, context = { hotkeyLayer: HotkeyServiceMock }) =>
        shallow(<HotkeyHelpModal onRequestClose={sandbox.stub()} {...props} />, { context });

    beforeEach(() => {
        HotkeyServiceMock = {
            getActiveHotkeys: sandbox.stub().returns({ other: [new HotkeyRecord()] }),
            getActiveTypes: sandbox.stub().returns(['other']),
        };
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render a HotkeyFriendlyModal', () => {
            const wrapper = getWrapper();

            const modal = wrapper.find('HotkeyFriendlyModal');
            expect(modal.length).toBe(1);
            expect(modal.prop('onRequestClose')).toBeTruthy();
            expect(modal.prop('isOpen')).toBeFalsy();
            expect(wrapper.find('ModalActions').length).toBe(1);
        });

        test('should pass isOpen prop to modal when modal is open', () => {
            const wrapper = getWrapper({ isOpen: true });

            const modal = wrapper.find('HotkeyFriendlyModal');
            expect(modal.prop('isOpen')).toBe(true);
        });

        test('should return null when no hotkeys exist', () => {
            HotkeyServiceMock.getActiveHotkeys = sandbox.stub().returns({});
            HotkeyServiceMock.getActiveTypes = sandbox.stub().returns([]);
            const wrapper = getWrapper();

            expect(wrapper.get(0)).toBeFalsy();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should set state.currentType when state.currentType is null', () => {
            const wrapper = getWrapper();
            wrapper.setState({ currentType: null });

            sandbox.mock(wrapper.instance()).expects('setState');

            wrapper.setProps({
                isOpen: true,
            });
        });

        test('should refresh hotkey and hotkey types from hotkeyService when modal is opened', () => {
            const wrapper = getWrapper();

            wrapper.setProps({ isOpen: true });

            // should've been called once in constructor and once in componentDidMount
            expect(HotkeyServiceMock.getActiveHotkeys.calledTwice).toBe(true);
            expect(HotkeyServiceMock.getActiveTypes.calledTwice).toBe(true);
        });
    });

    describe('renderDropdownMenu()', () => {
        test('should render DropdownMenu with correct items', () => {
            HotkeyServiceMock.getActiveHotkeys = sandbox.stub().returns({
                hello: [new HotkeyRecord()],
                hi: [new HotkeyRecord()],
                hey: [new HotkeyRecord()],
            });
            HotkeyServiceMock.getActiveTypes = sandbox.stub().returns(['hello', 'hi', 'hey']);

            const wrapper = getWrapper();

            expect(wrapper.find('MenuItem').length).toBe(3);
        });
    });

    describe('renderHotkeyList()', () => {
        test('should render hotkeys for currently selected type', () => {
            HotkeyServiceMock.getActiveHotkeys = sandbox.stub().returns({
                navigation: [
                    {
                        description: 'hi',
                        key: 'a',
                    },
                    {
                        description: 'hi',
                        key: 'b',
                    },
                ],
                other: [
                    {
                        description: 'hi',
                        key: 'c',
                    },
                    {
                        description: 'hi',
                        key: 'd',
                    },
                    {
                        description: 'hi',
                        key: 'e',
                    },
                ],
            });
            HotkeyServiceMock.getActiveTypes = sandbox.stub().returns(['navigation', 'other']);

            const wrapper = getWrapper();

            wrapper.setState({
                currentType: 'navigation',
            });

            // should render the two 'navigation' hotkeys
            expect(wrapper.find('.hotkey-item').length).toBe(2);

            wrapper.setState({
                currentType: 'other',
            });

            // should render the three 'other' hotkeys
            expect(wrapper.find('.hotkey-item').length).toBe(3);
        });
    });

    describe('renderHotkey()', () => {
        test('should render hotkey correctly', () => {
            HotkeyServiceMock.getActiveHotkeys = sandbox.stub().returns({
                navigation: [
                    {
                        description: 'hi',
                        key: 'shift+a+b+c',
                    },
                ],
            });
            HotkeyServiceMock.getActiveTypes = sandbox.stub().returns(['navigation']);

            const wrapper = getWrapper();

            // should render one hotkey
            expect(wrapper.find('.hotkey-key').children().length).toBe(1);

            // kbd elements should be [ "shift", "a", "b", "c" ]
            expect(wrapper.find('kbd').length).toBe(4);
        });

        test('should render all keys when a hotkey has multiple hotkeys', () => {
            HotkeyServiceMock.getActiveHotkeys = sandbox.stub().returns({
                navigation: [
                    {
                        description: 'hi',
                        key: ['shift+a', 'alt+a'],
                    },
                ],
            });
            HotkeyServiceMock.getActiveTypes = sandbox.stub().returns(['navigation']);

            const wrapper = getWrapper();

            // elements should be [ "shift+a", "/", "alt+a" ] (i.e. length 3)
            expect(wrapper.find('.hotkey-key').children().length).toBe(3);

            // kbd elements should be [ "shift", "a", "alt", "a" ]
            expect(wrapper.find('.hotkey-key kbd').length).toBe(4);
        });
    });
});
