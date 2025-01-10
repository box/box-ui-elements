import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { HotkeyProvider } from '../HotkeyContext';
import HotkeyRecord from '../HotkeyRecord';
import HotkeyService from '../HotkeyService';
import HotkeyHelpModal from '../HotkeyHelpModal';

describe('components/hotkeys/components/HotkeyHelpModal', () => {
    const defaultProps = {
        onRequestClose: jest.fn(),
    };

    const createMockHotkeyService = (overrides = {}) => {
        const service = new HotkeyService();
        service.getActiveHotkeys = jest.fn().mockReturnValue({ other: [new HotkeyRecord()] });
        service.getActiveTypes = jest.fn().mockReturnValue(['other']);
        service.registerHotkey = jest.fn();
        service.deregisterHotkey = jest.fn();
        Object.assign(service, overrides);
        return service;
    };

    const renderWithHotkeys = (ui, customHotkeyService) => {
        const hotkeyService = customHotkeyService || createMockHotkeyService();
        const result = render(<HotkeyProvider hotkeyService={hotkeyService}>{ui}</HotkeyProvider>);
        return {
            ...result,
            hotkeyService,
            rerender: newUi => result.rerender(<HotkeyProvider hotkeyService={hotkeyService}>{newUi}</HotkeyProvider>),
        };
    };

    describe('render()', () => {
        test('should render a HotkeyFriendlyModal when open', () => {
            renderWithHotkeys(<HotkeyHelpModal {...defaultProps} isOpen={true} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        });

        test('should not render modal when not open', () => {
            renderWithHotkeys(<HotkeyHelpModal {...defaultProps} isOpen={false} />);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        test('should return null when no hotkeys exist', () => {
            const emptyHotkeyService = createMockHotkeyService({
                getActiveHotkeys: jest.fn().mockReturnValue({}),
                getActiveTypes: jest.fn().mockReturnValue([]),
            });
            renderWithHotkeys(<HotkeyHelpModal {...defaultProps} isOpen={true} />, emptyHotkeyService);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should update hotkeys when modal is opened', async () => {
            const hotkeyService = createMockHotkeyService();
            const { rerender } = renderWithHotkeys(<HotkeyHelpModal {...defaultProps} isOpen={false} />, hotkeyService);

            rerender(<HotkeyHelpModal {...defaultProps} isOpen={true} />);

            // Wait for state updates
            await screen.findByRole('dialog');

            // Give time for the hotkey service to be called
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(hotkeyService.getActiveHotkeys).toHaveBeenCalled();
            expect(hotkeyService.getActiveTypes).toHaveBeenCalled();
        });
    });

    describe('renderDropdownMenu()', () => {
        test('should render DropdownMenu with correct items', () => {
            const hotkeyService = createMockHotkeyService({
                getActiveHotkeys: jest.fn().mockReturnValue({
                    hello: [new HotkeyRecord()],
                    hi: [new HotkeyRecord()],
                    hey: [new HotkeyRecord()],
                }),
                getActiveTypes: jest.fn().mockReturnValue(['hello', 'hi', 'hey']),
            });

            renderWithHotkeys(<HotkeyHelpModal {...defaultProps} isOpen={true} />, hotkeyService);
            expect(screen.getByText('hello')).toBeInTheDocument();
            expect(screen.getByText('hi')).toBeInTheDocument();
            expect(screen.getByText('hey')).toBeInTheDocument();
        });
    });

    describe('renderHotkeyList()', () => {
        test('should render hotkeys for currently selected type', () => {
            const hotkeyService = createMockHotkeyService({
                getActiveHotkeys: jest.fn().mockReturnValue({
                    navigation: [
                        { description: 'nav1', key: 'a' },
                        { description: 'nav2', key: 'b' },
                    ],
                    other: [
                        { description: 'other1', key: 'c' },
                        { description: 'other2', key: 'd' },
                        { description: 'other3', key: 'e' },
                    ],
                }),
                getActiveTypes: jest.fn().mockReturnValue(['navigation', 'other']),
            });

            renderWithHotkeys(<HotkeyHelpModal {...defaultProps} isOpen={true} />, hotkeyService);

            // Initial type should be 'navigation'
            expect(screen.getByText('nav1')).toBeInTheDocument();
            expect(screen.getByText('nav2')).toBeInTheDocument();
        });
    });

    describe('renderHotkey()', () => {
        test('should render hotkey correctly', () => {
            const hotkeyService = createMockHotkeyService({
                getActiveHotkeys: jest.fn().mockReturnValue({
                    navigation: [
                        {
                            description: 'test hotkey',
                            key: 'shift+a+b+c',
                        },
                    ],
                }),
                getActiveTypes: jest.fn().mockReturnValue(['navigation']),
            });

            renderWithHotkeys(<HotkeyHelpModal {...defaultProps} isOpen={true} />, hotkeyService);

            // Verify description and key combinations
            expect(screen.getByText('test hotkey')).toBeInTheDocument();
            const kbdElements = screen.getAllByRole('definition');
            expect(kbdElements).toHaveLength(4); // shift, a, b, c
        });

        test('should render all keys when a hotkey has multiple hotkeys', () => {
            const hotkeyService = createMockHotkeyService({
                getActiveHotkeys: jest.fn().mockReturnValue({
                    navigation: [
                        {
                            description: 'multi hotkey',
                            key: ['shift+a', 'alt+a'],
                        },
                    ],
                }),
                getActiveTypes: jest.fn().mockReturnValue(['navigation']),
            });

            renderWithHotkeys(<HotkeyHelpModal {...defaultProps} isOpen={true} />, hotkeyService);

            // Verify description and key combinations
            expect(screen.getByText('multi hotkey')).toBeInTheDocument();
            const kbdElements = screen.getAllByRole('definition');
            expect(kbdElements).toHaveLength(4); // shift, a, alt, a
        });
    });
});
