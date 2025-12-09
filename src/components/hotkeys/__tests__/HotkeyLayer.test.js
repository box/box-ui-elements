import * as React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import HotkeyRecord from '../HotkeyRecord';
import HotkeyLayer from '../HotkeyLayer';
import HotkeyService from '../HotkeyService';

const sandbox = sinon.sandbox.create();

jest.mock('../HotkeyService');
describe('components/hotkeys/HotkeyLayer', () => {
    // This is required to prevent actually invoking HotkeyService, which causes
    // HotkeyService tests to fail
    HotkeyService.mockImplementation(() => {});

    afterEach(() => {
        sandbox.verifyAndRestore();
        HotkeyService.mockClear();
    });

    describe('HotkeyContext.Provider', () => {
        test('should provide the hotkey service via context', () => {
            const wrapper = shallow(
                <HotkeyLayer>
                    <div />
                </HotkeyLayer>,
            );

            const provider = wrapper.find('ContextProvider');
            expect(provider.length).toBe(1);
            expect(provider.prop('value')).toEqual(wrapper.instance().hotkeyService);
        });
    });

    describe('componentWillUnmount()', () => {
        test('should destroy current layer', () => {
            const wrapper = shallow(
                <HotkeyLayer>
                    <div />
                </HotkeyLayer>,
                {
                    disableLifecycleMethods: true,
                },
            );
            wrapper.instance().hotkeyService = {
                destroyLayer: sandbox.mock(),
            };

            wrapper.instance().componentWillUnmount();
        });
    });

    describe('render()', () => {
        test('should render children', () => {
            const wrapper = shallow(
                <HotkeyLayer>
                    <div className="content">hi</div>
                </HotkeyLayer>,
            );

            expect(wrapper.find('div.content').length).toBe(1);
        });

        describe('help modal enabled', () => {
            test('should render Hotkeys component, HotkeyHelpModal component, and children', () => {
                const wrapper = shallow(
                    <HotkeyLayer enableHelpModal>
                        <div>hi</div>
                    </HotkeyLayer>,
                );

                expect(wrapper.find('Hotkeys').length).toBe(1);
                expect(wrapper.find('HotkeyHelpModal').length).toBe(1);
                expect(wrapper.contains(<div>hi</div>)).toBe(true);
            });

            test('should pass shortcut to open help modal', () => {
                const wrapper = shallow(
                    <HotkeyLayer
                        configs={[
                            new HotkeyRecord({
                                key: 'a',
                            }),
                        ]}
                        enableHelpModal
                    >
                        <div>hi</div>
                    </HotkeyLayer>,
                );

                const hotkeys = wrapper.find('Hotkeys');
                expect(hotkeys.prop('configs').length).toBe(2);
                expect(hotkeys.prop('configs')[0].key).toEqual('?');
            });
        });

        describe('help modal disabled', () => {
            test('should not render HotkeyHelpModal', () => {
                const wrapper = shallow(
                    <HotkeyLayer>
                        <div />
                    </HotkeyLayer>,
                );

                expect(wrapper.find('HotkeyHelpModal').length).toBe(0);
            });
        });
    });

    describe('getHotkeyConfigs()', () => {
        test('should return "?" shortcut to open help modal when help modal is enabled', () => {
            const wrapper = shallow(<HotkeyLayer enableHelpModal />);

            sandbox.mock(wrapper.instance()).expects('openHelpModal');

            const configs = wrapper.instance().getHotkeyConfigs();
            configs[0].handler();
            expect(configs[0].key).toEqual('?');
        });

        test('should return custom shortcut to open help modal when custom shortcut is provided', () => {
            const wrapper = shallow(
                <HotkeyLayer helpModalShortcut="!" enableHelpModal>
                    <div>hi</div>
                </HotkeyLayer>,
            );

            const configs = wrapper.instance().getHotkeyConfigs();
            expect(configs[0].key).toEqual('!');
        });

        test('should return empty array when help modal is disabled', () => {
            const wrapper = shallow(
                <HotkeyLayer>
                    <div />
                </HotkeyLayer>,
            );

            const configs = wrapper.instance().getHotkeyConfigs();
            expect(configs.length).toBe(0);
        });
    });

    describe('openHelpModal()', () => {
        test('should set state.isHelpModalOpen to true', () => {
            const wrapper = shallow(<HotkeyLayer enableHelpModal />);

            wrapper.instance().openHelpModal();

            expect(wrapper.state('isHelpModalOpen')).toBe(true);
        });
    });

    describe('closeHelpModal()', () => {
        test('should set state.isHelpModalOpen to false', () => {
            const wrapper = shallow(<HotkeyLayer enableHelpModal />);

            wrapper.instance().closeHelpModal();

            expect(wrapper.state('isHelpModalOpen')).toBe(false);
        });
    });
});
