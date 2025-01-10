import * as React from 'react';
import { render } from '@testing-library/react';
import HotkeyRecord from '../HotkeyRecord';
import Hotkeys from '../Hotkeys';
import { HotkeyProvider } from '../HotkeyContext';

const createMockHotkeyService = () => {
    const registeredHotkeys = new Map();
    let layerId = null;

    const service = {
        registerHotkey: jest.fn(hotkeyConfig => {
            const { key } = hotkeyConfig;
            const keys = Array.isArray(key) ? key : [key];
            const existingKey = keys.find(k => registeredHotkeys.has(k));

            if (existingKey) {
                throw new Error(`This app is trying to bind multiple actions to the hot keys: ${existingKey}.`);
            }

            keys.forEach(k => registeredHotkeys.set(k, hotkeyConfig));
        }),
        deregisterHotkey: jest.fn(hotkeyConfig => {
            const { key } = hotkeyConfig;
            const keys = Array.isArray(key) ? key : [key];
            keys.forEach(k => registeredHotkeys.delete(k));
        }),
        getActiveHotkeys: jest.fn(() => ({})),
        getActiveTypes: jest.fn(() => []),
        destroyLayer: jest.fn(),
        setActiveLayer: jest.fn(id => {
            layerId = id;
        }),
        removeLayer: jest.fn(id => {
            if (layerId === id) layerId = null;
        }),
    };

    // Initialize the service
    service.getActiveHotkeys.mockReturnValue({});
    service.getActiveTypes.mockReturnValue([]);

    return service;
};

describe('components/hotkeys/Hotkeys', () => {
    let mockHotkeyService;

    beforeEach(() => {
        mockHotkeyService = createMockHotkeyService();
        mockHotkeyService.setActiveLayer('test-layer');
    });

    afterEach(() => {
        jest.clearAllMocks();
        if (mockHotkeyService) {
            mockHotkeyService.removeLayer('test-layer');
        }
    });

    const renderWithHotkeys = (ui, customHotkeyService) => {
        const hotkeyService = customHotkeyService || createMockHotkeyService();
        if (!customHotkeyService) {
            hotkeyService.setActiveLayer('test-layer');
        }

        const result = render(<HotkeyProvider hotkeyService={hotkeyService}>{ui}</HotkeyProvider>);

        // Return both the render result and the hotkeyService for test usage
        return {
            ...result,
            hotkeyService,
        };
    };

    describe('componentDidMount()', () => {
        test('should call hotkeyLayer.registerHotkey for each hotkey config', () => {
            const configs = [
                new HotkeyRecord({ key: 'a' }),
                new HotkeyRecord({ key: 'b' }),
                new HotkeyRecord({ key: 'c' }),
            ];

            const hotkeyService = createMockHotkeyService();
            hotkeyService.setActiveLayer('test-layer');

            renderWithHotkeys(
                <Hotkeys configs={configs}>
                    <div />
                </Hotkeys>,
                hotkeyService,
            );

            expect(hotkeyService.registerHotkey).toHaveBeenCalledTimes(3);
            configs.forEach(config => {
                expect(hotkeyService.registerHotkey).toHaveBeenCalledWith(config);
            });
        });

        test('should throw error when hotkey layer is not initialized', () => {
            // Mock console.error to prevent React error logging
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            // Create an invalid service that's missing required methods
            const invalidService = {
                getActiveHotkeys: jest.fn(),
                getActiveTypes: jest.fn(),
                // Missing registerHotkey and deregisterHotkey
            };

            expect(() => {
                renderWithHotkeys(
                    <Hotkeys configs={[new HotkeyRecord({ key: 'test-key' })]}>
                        <div />
                    </Hotkeys>,
                    invalidService,
                );
            }).toThrow('HotkeyProvider requires a valid hotkeyService prop');

            consoleError.mockRestore();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should remove any hot keys removed from the properties', () => {
            const configs = [
                new HotkeyRecord({ key: 'a' }),
                new HotkeyRecord({ key: 'b' }),
                new HotkeyRecord({ key: 'c' }),
            ];

            const { rerender, hotkeyService } = renderWithHotkeys(
                <Hotkeys configs={configs}>
                    <div />
                </Hotkeys>,
            );

            // Verify initial registration
            expect(hotkeyService.registerHotkey).toHaveBeenCalledTimes(3);
            configs.forEach(config => {
                expect(hotkeyService.registerHotkey).toHaveBeenCalledWith(config);
            });

            // Reset mock counts for deregister test
            hotkeyService.deregisterHotkey.mockClear();

            rerender(
                <HotkeyProvider hotkeyService={hotkeyService}>
                    <Hotkeys configs={[configs[1]]}>
                        <div />
                    </Hotkeys>
                </HotkeyProvider>,
            );

            expect(hotkeyService.deregisterHotkey).toHaveBeenCalledTimes(2);
            expect(hotkeyService.deregisterHotkey).toHaveBeenCalledWith(configs[0]);
            expect(hotkeyService.deregisterHotkey).toHaveBeenCalledWith(configs[2]);
        });

        test('should throw error when hotkey layer is not initialized', () => {
            // Mock console.error to avoid React error logging
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            // Create a mock service with null methods to simulate uninitialized state
            const uninitializedService = {
                getActiveHotkeys: null,
                getActiveTypes: null,
                registerHotkey: null,
                deregisterHotkey: null,
                setActiveLayer: null,
                removeLayer: null,
            };

            expect(() => {
                renderWithHotkeys(
                    <Hotkeys configs={[new HotkeyRecord({ key: 'test-key' })]}>
                        <div />
                    </Hotkeys>,
                    uninitializedService,
                );
            }).toThrow('You must instantiate a HotkeyLayer before using Hotkeys');

            consoleError.mockRestore();
        });
    });

    describe('componentWillUnmount()', () => {
        test('should call hotkeyLayer.deregisterHotkey for each hotkey config', () => {
            const configs = [
                new HotkeyRecord({ key: 'a' }),
                new HotkeyRecord({ key: 'b' }),
                new HotkeyRecord({ key: 'c' }),
            ];

            const hotkeyService = createMockHotkeyService();
            hotkeyService.setActiveLayer('test-layer');

            const { unmount } = renderWithHotkeys(
                <Hotkeys configs={configs}>
                    <div />
                </Hotkeys>,
                hotkeyService,
            );

            unmount();
            expect(hotkeyService.deregisterHotkey).toHaveBeenCalledTimes(3);
            configs.forEach(config => {
                expect(hotkeyService.deregisterHotkey).toHaveBeenCalledWith(config);
            });
        });
    });

    describe('render()', () => {
        test('should render children', () => {
            const { container } = renderWithHotkeys(
                <Hotkeys configs={[]}>
                    <div>hi</div>
                </Hotkeys>,
            );

            expect(container.textContent).toBe('hi');
        });

        test('should render null when no children', () => {
            const { container } = renderWithHotkeys(<Hotkeys configs={[]} />);

            expect(container.firstChild).toBeNull();
        });
    });
});
