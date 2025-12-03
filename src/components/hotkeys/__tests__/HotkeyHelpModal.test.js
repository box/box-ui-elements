import * as React from 'react';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';

import HotkeyRecord from '../HotkeyRecord';
import HotkeyHelpModal from '../HotkeyHelpModal';
import { HotkeyContext } from '../HotkeyContext';
import { createContextTestWrapper } from './testHelpers';

const sandbox = sinon.sandbox.create();

describe('components/hotkeys/components/HotkeyHelpModal', () => {
    let HotkeyServiceMock;

    const getWrapper = (props = {}, contextValue = HotkeyServiceMock) => {
        const wrapper = shallow(
            <HotkeyContext.Provider value={contextValue}>
                <HotkeyHelpModal onRequestClose={sandbox.stub()} {...props} />
            </HotkeyContext.Provider>,
        );
        const hotkeyHelpModal = wrapper.find('HotkeyHelpModal').dive();
        // Manually set context for contextType
        const instance = hotkeyHelpModal.instance();
        if (instance && contextValue) {
            instance.context = contextValue;
            // Re-initialize hotkeys and types since constructor ran before context was set
            if (contextValue.getActiveHotkeys && contextValue.getActiveTypes) {
                instance.hotkeys = contextValue.getActiveHotkeys();
                instance.types = contextValue.getActiveTypes();
                // Update state if we have types but no currentType
                if (instance.types.length && !instance.state.currentType) {
                    instance.setState({ currentType: instance.types[0] });
                }
            }
        }
        return { wrapper, hotkeyHelpModal };
    };

    beforeEach(() => {
        HotkeyServiceMock = {
            getActiveHotkeys: sandbox.stub().returns({ other: [new HotkeyRecord()] }),
            getActiveTypes: sandbox.stub().returns(['other']),
        };
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const createTestWrapper = (initialIsOpen = false) => {
        return createContextTestWrapper({
            contextValue: HotkeyServiceMock,
            initialState: { isOpen: initialIsOpen },
            renderChild: state => <HotkeyHelpModal onRequestClose={sandbox.stub()} isOpen={state.isOpen} />,
        });
    };

    describe('render()', () => {
        test('should render a HotkeyFriendlyModal', () => {
            const { hotkeyHelpModal } = getWrapper();

            const modal = hotkeyHelpModal.find('HotkeyFriendlyModal');
            expect(modal.length).toBe(1);
            expect(modal.prop('onRequestClose')).toBeTruthy();
            expect(modal.prop('isOpen')).toBeFalsy();
            expect(hotkeyHelpModal.find('ModalActions').length).toBe(1);
        });

        test('should pass isOpen prop to modal when modal is open', () => {
            const { hotkeyHelpModal } = getWrapper({ isOpen: true });

            const modal = hotkeyHelpModal.find('HotkeyFriendlyModal');
            expect(modal.prop('isOpen')).toBe(true);
        });

        test('should return null when no hotkeys exist', () => {
            HotkeyServiceMock.getActiveHotkeys = sandbox.stub().returns({});
            HotkeyServiceMock.getActiveTypes = sandbox.stub().returns([]);
            const { hotkeyHelpModal } = getWrapper();

            expect(hotkeyHelpModal.get(0)).toBeFalsy();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should set state.currentType when state.currentType is null', () => {
            const TestWrapper = createTestWrapper(false);
            const wrapper = mount(<TestWrapper />);
            const hotkeyHelpModal = wrapper.find('HotkeyHelpModal');
            const instance = hotkeyHelpModal.instance();

            // Set currentType to null to test the componentDidUpdate logic
            instance.setState({ currentType: null });

            const setStateMock = sandbox.mock(instance).expects('setState');

            act(() => {
                wrapper.find('TestWrapper').setState({ isOpen: true });
            });
            wrapper.update();

            setStateMock.verify();
            wrapper.unmount();
        });

        test('should refresh hotkey and hotkey types from hotkeyService when modal is opened', () => {
            const TestWrapper = createTestWrapper(false);
            const wrapper = mount(<TestWrapper />);

            // Get initial call count (constructor may or may not call it depending on context timing)
            const initialHotkeysCount = HotkeyServiceMock.getActiveHotkeys.callCount;
            const initialTypesCount = HotkeyServiceMock.getActiveTypes.callCount;

            act(() => {
                wrapper.find('TestWrapper').setState({ isOpen: true });
            });
            wrapper.update();

            // componentDidUpdate should call it when modal opens (context is available in componentDidUpdate)
            // The key assertion is that it was called when isOpen changed from false to true
            expect(HotkeyServiceMock.getActiveHotkeys.callCount).toBeGreaterThan(initialHotkeysCount);
            expect(HotkeyServiceMock.getActiveTypes.callCount).toBeGreaterThan(initialTypesCount);

            // Verify it was called at least once (in componentDidUpdate when modal opens)
            expect(HotkeyServiceMock.getActiveHotkeys.callCount).toBeGreaterThanOrEqual(1);
            expect(HotkeyServiceMock.getActiveTypes.callCount).toBeGreaterThanOrEqual(1);

            wrapper.unmount();
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

            const { hotkeyHelpModal } = getWrapper();

            expect(hotkeyHelpModal.find('MenuItem').length).toBe(3);
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

            const { hotkeyHelpModal } = getWrapper();

            hotkeyHelpModal.setState({
                currentType: 'navigation',
            });

            // should render the two 'navigation' hotkeys
            expect(hotkeyHelpModal.find('.hotkey-item').length).toBe(2);

            hotkeyHelpModal.setState({
                currentType: 'other',
            });

            // should render the three 'other' hotkeys
            expect(hotkeyHelpModal.find('.hotkey-item').length).toBe(3);
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

            const { hotkeyHelpModal } = getWrapper();

            // should render one hotkey
            expect(hotkeyHelpModal.find('.hotkey-key').children().length).toBe(1);

            // kbd elements should be [ "shift", "a", "b", "c" ]
            expect(hotkeyHelpModal.find('kbd').length).toBe(4);
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

            const { hotkeyHelpModal } = getWrapper();

            // elements should be [ "shift+a", "/", "alt+a" ] (i.e. length 3)
            expect(hotkeyHelpModal.find('.hotkey-key').children().length).toBe(3);

            // kbd elements should be [ "shift", "a", "alt", "a" ]
            expect(hotkeyHelpModal.find('.hotkey-key kbd').length).toBe(4);
        });
    });
});
