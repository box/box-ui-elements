import React from 'react';
import sinon from 'sinon';

import HotkeyRecord from '../HotkeyRecord';

import Hotkeys from '../Hotkeys';

const sandbox = sinon.sandbox.create();

describe('components/hotkeys/Hotkeys', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('componentDidMount()', () => {
        test('should call hotkeyLayer.registerHotkey for each hotkey config', () => {
            shallow(
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
                    context: {
                        hotkeyLayer: {
                            registerHotkey: sandbox.mock().thrice(),
                        },
                    },
                },
            );
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

            expect(() => {
                wrapper.instance().componentDidMount();
            }).toThrow();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should remove any hot keys removed from the properties', () => {
            const configs = [
                new HotkeyRecord({ key: 'a' }),
                new HotkeyRecord({ key: 'b' }),
                new HotkeyRecord({ key: 'c' }),
            ];
            const wrapper = shallow(
                <Hotkeys configs={configs}>
                    <div />
                </Hotkeys>,
                {
                    context: {
                        hotkeyLayer: {
                            registerHotkey: sandbox.stub(),
                            deregisterHotkey: sandbox.mock().twice(),
                        },
                    },
                },
            );

            wrapper.setProps({
                configs: [configs[1]],
            });
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

            expect(() => {
                wrapper.instance().componentDidMount();
            }).toThrow();
        });
    });

    describe('componentWillUnmount()', () => {
        test('should call hotkeyLayer.deregisterHotkey for each hotkey config', () => {
            shallow(
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
                    context: {
                        hotkeyLayer: {
                            registerHotkey: sandbox.stub(),
                            deregisterHotkey: sandbox.mock().thrice(),
                        },
                    },
                },
            ).unmount();
        });
    });

    describe('render()', () => {
        test('should render children', () => {
            const wrapper = shallow(
                <Hotkeys configs={[]}>
                    <div>hi</div>
                </Hotkeys>,
                {
                    context: {
                        hotkeyLayer: {
                            registerHotkey: sandbox.stub(),
                        },
                    },
                },
            );

            expect(wrapper.contains(<div>hi</div>)).toBe(true);
        });

        test('should render null when no children', () => {
            const wrapper = shallow(<Hotkeys configs={[]} />, {
                context: {
                    hotkeyLayer: {
                        registerHotkey: sandbox.stub(),
                    },
                },
            });

            expect(wrapper.type()).toBeNull();
        });
    });
});
