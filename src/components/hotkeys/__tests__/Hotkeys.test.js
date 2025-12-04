import * as React from 'react';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';

import HotkeyRecord from '../HotkeyRecord';
import { HotkeyContext } from '../HotkeyContext';
import { HotkeyTestWrapper } from './HotkeyTestWrapper';

import Hotkeys from '../Hotkeys';

const sandbox = sinon.sandbox.create();

describe('components/hotkeys/Hotkeys', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('componentDidMount()', () => {
        test('should call hotkeyLayer.registerHotkey for each hotkey config', () => {
            const mockHotkeyLayer = {
                registerHotkey: sandbox.mock().thrice(),
            };

            mount(
                <HotkeyContext.Provider value={mockHotkeyLayer}>
                    <Hotkeys
                        configs={[
                            new HotkeyRecord({ key: 'a' }),
                            new HotkeyRecord({ key: 'b' }),
                            new HotkeyRecord({ key: 'c' }),
                        ]}
                    >
                        <div />
                    </Hotkeys>
                </HotkeyContext.Provider>,
            );
        });

        test('should throw error when hotkey layer does not exist', () => {
            expect(() => {
                mount(
                    <Hotkeys
                        configs={[
                            new HotkeyRecord({ key: 'a' }),
                            new HotkeyRecord({ key: 'b' }),
                            new HotkeyRecord({ key: 'c' }),
                        ]}
                    >
                        <div />
                    </Hotkeys>,
                );
            }).toThrow('You must instantiate a HotkeyLayer before using Hotkeys');
        });
    });

    describe('componentDidUpdate()', () => {
        test('should remove any hot keys removed from the properties', () => {
            const configs = [
                new HotkeyRecord({ key: 'a' }),
                new HotkeyRecord({ key: 'b' }),
                new HotkeyRecord({ key: 'c' }),
            ];
            const mockHotkeyLayer = {
                registerHotkey: sandbox.stub(),
                deregisterHotkey: sandbox.stub(),
            };

            const wrapper = mount(
                <HotkeyTestWrapper
                    contextValue={mockHotkeyLayer}
                    initialState={{ configs }}
                    renderChild={state => (
                        <Hotkeys configs={state.configs}>
                            <div />
                        </Hotkeys>
                    )}
                />,
            );

            // Update state to trigger componentDidUpdate naturally
            act(() => {
                wrapper.find('HotkeyTestWrapper').setState({ configs: [configs[1]] });
            });
            wrapper.update();

            // Verify that deregisterHotkey was called twice (for 'a' and 'c')
            expect(mockHotkeyLayer.deregisterHotkey.callCount).toBe(2);
        });

        test('should throw error when hotkey layer does not exist', () => {
            const wrapper = shallow(
                <Hotkeys
                    configs={[
                        new HotkeyRecord({ key: 'a' }),
                        new HotkeyRecord({ key: 'b' }),
                        new HotkeyRecord({ key: 'c' }),
                    ]}
                >
                    <div />
                </Hotkeys>,
                {
                    disableLifecycleMethods: true,
                },
            );

            // componentDidUpdate would throw when trying to add hotkeys if context is null
            expect(() => {
                wrapper.instance().componentDidUpdate({
                    configs: [new HotkeyRecord({ key: 'a' })],
                });
            }).toThrow();
        });
    });

    describe('componentWillUnmount()', () => {
        test('should call hotkeyLayer.deregisterHotkey for each hotkey config', () => {
            const mockHotkeyLayer = {
                registerHotkey: sandbox.stub(),
                deregisterHotkey: sandbox.mock().thrice(),
            };

            const wrapper = mount(
                <HotkeyContext.Provider value={mockHotkeyLayer}>
                    <Hotkeys
                        configs={[
                            new HotkeyRecord({ key: 'a' }),
                            new HotkeyRecord({ key: 'b' }),
                            new HotkeyRecord({ key: 'c' }),
                        ]}
                    >
                        <div />
                    </Hotkeys>
                </HotkeyContext.Provider>,
            );

            wrapper.unmount();
        });
    });

    describe('render()', () => {
        test('should render children', () => {
            const mockHotkeyLayer = {
                registerHotkey: sandbox.stub(),
            };

            const wrapper = mount(
                <HotkeyContext.Provider value={mockHotkeyLayer}>
                    <Hotkeys configs={[]}>
                        <div>hi</div>
                    </Hotkeys>
                </HotkeyContext.Provider>,
            );

            expect(wrapper.contains(<div>hi</div>)).toBe(true);
        });

        test('should render null when no children', () => {
            const mockHotkeyLayer = {
                registerHotkey: sandbox.stub(),
            };

            const wrapper = mount(
                <HotkeyContext.Provider value={mockHotkeyLayer}>
                    <Hotkeys configs={[]} />
                </HotkeyContext.Provider>,
            );

            // Hotkeys returns null when no children, so the wrapper should be empty
            expect(wrapper.find('Hotkeys').children().length).toBe(0);
        });
    });
});
