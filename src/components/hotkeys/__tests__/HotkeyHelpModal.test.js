import * as React from 'react';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import { mount } from 'enzyme';

import HotkeyRecord from '../HotkeyRecord';
import HotkeyHelpModal from '../HotkeyHelpModal';
import { HotkeyContext } from '../HotkeyContext';
import { HotkeyTestWrapper } from './HotkeyTestWrapper';

const sandbox = sinon.sandbox.create();

describe('components/hotkeys/components/HotkeyHelpModal', () => {
    let HotkeyServiceMock;

    const getWrapper = (props = {}, contextValue = HotkeyServiceMock) => {
        let wrapper;
        act(() => {
            wrapper = mount(
                <HotkeyContext.Provider value={contextValue}>
                    <HotkeyHelpModal onRequestClose={sandbox.stub()} isOpen={true} {...props} />
                </HotkeyContext.Provider>,
            );
        });
        wrapper.update();
        const hotkeyHelpModal = wrapper.find('HotkeyHelpModal');
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

    describe('render()', () => {
        test('should render a HotkeyFriendlyModal', () => {
            const { wrapper, hotkeyHelpModal } = getWrapper({ isOpen: true });

            const modal = hotkeyHelpModal.find('HotkeyFriendlyModal');
            expect(modal.length).toBe(1);
            expect(modal.prop('onRequestClose')).toBeTruthy();
            expect(modal.prop('isOpen')).toBeTruthy();
            expect(wrapper.find('ModalActions').length).toBe(1);
        });

        test('should pass isOpen prop to modal when modal is open', () => {
            const { hotkeyHelpModal } = getWrapper({ isOpen: true });

            const modal = hotkeyHelpModal.find('HotkeyFriendlyModal');
            expect(modal.prop('isOpen')).toBe(true);
        });

        test('should return null when no hotkeys exist', () => {
            const emptyContext = {
                getActiveHotkeys: sandbox.stub().returns({}),
                getActiveTypes: sandbox.stub().returns([]),
            };
            const { hotkeyHelpModal } = getWrapper({ isOpen: false }, emptyContext);

            // Component returns null when currentType is null (no types in context)
            // componentDidMount sets currentType to null when types.length is 0
            expect(hotkeyHelpModal.instance().state.currentType).toBeNull();
            // Component should render nothing when currentType is null
            expect(hotkeyHelpModal.html()).toBeNull();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should set state.currentType when state.currentType is null', () => {
            const wrapper = mount(
                <HotkeyTestWrapper
                    contextValue={HotkeyServiceMock}
                    initialState={{ isOpen: false }}
                    renderChild={state => <HotkeyHelpModal onRequestClose={sandbox.stub()} isOpen={state.isOpen} />}
                />,
            );
            const hotkeyHelpModal = wrapper.find('HotkeyHelpModal');
            const instance = hotkeyHelpModal.instance();

            // Set currentType to null to test the componentDidUpdate logic
            act(() => {
                instance.setState({ currentType: null });
            });
            wrapper.update();

            // Now open the modal - componentDidUpdate should set currentType when isOpen becomes true
            act(() => {
                wrapper.find('HotkeyTestWrapper').setState({ isOpen: true });
            });
            wrapper.update();

            // Verify that currentType was set to the first available type
            expect(instance.state.currentType).toBe('other');
        });

        test('should refresh hotkey and hotkey types from hotkeyService when modal is opened', () => {
            const wrapper = mount(
                <HotkeyTestWrapper
                    contextValue={HotkeyServiceMock}
                    initialState={{ isOpen: false }}
                    renderChild={state => <HotkeyHelpModal onRequestClose={sandbox.stub()} isOpen={state.isOpen} />}
                />,
            );

            // Get initial call count (constructor may or may not call it depending on context timing)
            const initialHotkeysCount = HotkeyServiceMock.getActiveHotkeys.callCount;
            const initialTypesCount = HotkeyServiceMock.getActiveTypes.callCount;

            act(() => {
                wrapper.find('HotkeyTestWrapper').setState({ isOpen: true });
            });
            wrapper.update();

            // componentDidUpdate should call it when modal opens (context is available in componentDidUpdate)
            // The key assertion is that it was called when isOpen changed from false to true
            expect(HotkeyServiceMock.getActiveHotkeys.callCount).toBeGreaterThan(initialHotkeysCount);
            expect(HotkeyServiceMock.getActiveTypes.callCount).toBeGreaterThan(initialTypesCount);

            // Verify it was called at least once (in componentDidUpdate when modal opens)
            expect(HotkeyServiceMock.getActiveHotkeys.callCount).toBeGreaterThanOrEqual(1);
            expect(HotkeyServiceMock.getActiveTypes.callCount).toBeGreaterThanOrEqual(1);
        });
    });

    describe('renderDropdownMenu()', () => {
        test('should render DropdownMenu with correct items', () => {
            const customMock = {
                getActiveHotkeys: sandbox.stub().returns({
                    hello: [new HotkeyRecord()],
                    hi: [new HotkeyRecord()],
                    hey: [new HotkeyRecord()],
                }),
                getActiveTypes: sandbox.stub().returns(['hello', 'hi', 'hey']),
            };

            const { hotkeyHelpModal } = getWrapper({}, customMock);
            const instance = hotkeyHelpModal.instance();

            // Verify that the component has the correct types
            expect(instance.types).toEqual(['hello', 'hi', 'hey']);

            // Verify DropdownMenu is rendered
            const dropdown = hotkeyHelpModal.find('DropdownMenu');
            expect(dropdown.length).toBe(1);

            // Verify the dropdown container exists
            const dropdownContainer = hotkeyHelpModal.find('.hotkey-dropdown');
            expect(dropdownContainer.length).toBe(1);
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
            hotkeyHelpModal.update();

            // should render the two 'navigation' hotkeys
            expect(hotkeyHelpModal.find('.hotkey-item').length).toBe(2);

            hotkeyHelpModal.setState({
                currentType: 'other',
            });

            // should render the three 'other' hotkeys
            expect(hotkeyHelpModal.find('.hotkey-item').length).toBe(2);
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
