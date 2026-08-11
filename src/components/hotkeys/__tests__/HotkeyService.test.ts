import { OrderedMap, OrderedSet } from 'immutable';
import sinon from 'sinon';

import Mousetrap from 'mousetrap';

import HotkeyService from '../HotkeyService';
import HotkeyRecord from '../HotkeyRecord';
import type { HotkeyConfig } from '../HotkeyRecord';
import HotkeyManager from '../HotkeyManager';

jest.mock('../HotkeyManager', () => ({
    getActiveLayerID: jest.fn(),
    setActiveLayer: jest.fn(),
    removeLayer: jest.fn(),
}));
jest.mock('mousetrap');

const sandbox = sinon.sandbox.create();

describe('components/hotkeys/HotkeyService', () => {
    let instance: HotkeyService;
    let callbackSpy: jest.Mock;

    beforeEach(() => {
        callbackSpy = jest.fn();

        const MousetrapMock = (el: { addEventListener: (type: string, callback: EventListener) => void }) => {
            el.addEventListener('keydown', callbackSpy);
            return {
                bind: sandbox.spy(),
                unbind: sandbox.spy(),
                reset: sandbox.spy(),
            };
        };

        (Mousetrap as unknown as jest.Mock).mockImplementation(MousetrapMock);

        instance = new HotkeyService();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        jest.resetModules();
        jest.resetAllMocks();
    });

    describe('constructor()', () => {
        test('should instantiate Mousetrap object and set event listener', () => {
            expect(instance.mousetrap).toBeTruthy();
            expect(instance.mousetrapEventHandler).toBeTruthy();
        });

        test('should add event listeners', () => {
            sandbox.mock(window).expects('addEventListener').thrice();

            instance = new HotkeyService();
        });

        test('should set this layer as active layer in hotkey manager', () => {
            expect(HotkeyManager.setActiveLayer).toHaveBeenCalledWith(instance.layerID);
        });
    });

    describe('mousetrapEventHandler()', () => {
        test('should call stopPropagation and callback when this layer is currently active', () => {
            (HotkeyManager.getActiveLayerID as jest.Mock).mockReturnValueOnce(instance.layerID);

            const stopPropagation = jest.fn();
            instance.mousetrapEventHandler({ stopPropagation } as unknown as KeyboardEvent);

            expect(stopPropagation).toHaveBeenCalled();
            expect(callbackSpy).toHaveBeenCalled();
        });

        test('should immediately return when this layer is not currently active', () => {
            (HotkeyManager.getActiveLayerID as jest.Mock).mockReturnValueOnce(`${instance.layerID}-not-this-layer`);

            const stopPropagation = jest.fn();
            instance.mousetrapEventHandler({ stopPropagation } as unknown as KeyboardEvent);

            expect(stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe('destroyLayer()', () => {
        test('should remove event listeners', () => {
            sandbox.mock(window).expects('removeEventListener').thrice();
            instance.destroyLayer();
        });

        test('should remove layer from hotkey manager', () => {
            instance.destroyLayer();

            expect(HotkeyManager.setActiveLayer).toHaveBeenCalledWith(instance.layerID);
        });
    });

    describe('reset()', () => {
        test('should reset hotkeys and call mousetrap.reset() when called', () => {
            // Test only cares that reset() clears the collection; OrderedSet stands in for OrderedMap
            instance.hotkeys = OrderedSet(['hi', 'hello']) as unknown as OrderedMap<string, HotkeyConfig>;

            instance.reset();

            expect(instance.hotkeys.size).toEqual(0);
            // called twice bc this.reset() is called in the constructor
            expect((instance.mousetrap.reset as sinon.SinonSpy).calledTwice).toBe(true);
        });
    });

    describe('getActiveHotkeys()', () => {
        test('should return object with active hotkeys sorted into "buckets" by type', () => {
            const navigationHotkey = new HotkeyRecord({
                key: 'a',
                type: 'navigation',
            });
            const otherHotkey = new HotkeyRecord({
                key: 'b',
                type: 'other',
            });
            const previewHotkey = new HotkeyRecord({
                key: 'c',
                type: 'preview',
            });
            const hotkeys = OrderedSet([navigationHotkey, otherHotkey, previewHotkey]);

            instance.hotkeys = hotkeys as unknown as OrderedMap<string, HotkeyConfig>;

            const expected = {
                navigation: [navigationHotkey],
                other: [otherHotkey],
                preview: [previewHotkey],
            };

            expect(instance.getActiveHotkeys()).toEqual(expected);
        });
    });

    describe('getActiveTypes()', () => {
        test('should return a list of the unique types of the currently active hotkeys', () => {
            const navigationHotkey = new HotkeyRecord({
                key: 'a',
                type: 'navigation',
            });
            const otherHotkey = new HotkeyRecord({
                key: 'b',
                type: 'other',
            });
            const previewHotkey = new HotkeyRecord({
                key: 'c',
                type: 'preview',
            });
            const hotkeys = OrderedSet([navigationHotkey, otherHotkey, previewHotkey, navigationHotkey]);

            instance.hotkeys = hotkeys as unknown as OrderedMap<string, HotkeyConfig>;

            const expected = ['navigation', 'other', 'preview'];

            expect(instance.getActiveTypes()).toEqual(expected);
        });
    });

    describe('registerHotkey()', () => {
        test('should add hotkey config and call mousetrap.bind', () => {
            const config = new HotkeyRecord({
                key: 'b',
            });

            instance.registerHotkey(config);

            expect(instance.hotkeys.contains(config)).toBe(true);
            expect((instance.mousetrap.bind as sinon.SinonSpy).calledOnce).toBe(true);
        });

        test('should ignore the request to register if the config was already registered', () => {
            const config = new HotkeyRecord({
                key: 'b',
            });

            instance.registerHotkey(config);
            instance.registerHotkey(config);

            expect((instance.mousetrap.bind as sinon.SinonSpy).calledOnce).toBe(true);
        });

        test('should throw an exception if a key is already in use by another config', () => {
            const config1 = new HotkeyRecord({
                key: 'b',
            });
            const config2 = new HotkeyRecord({
                key: 'b',
            });

            instance.registerHotkey(config1);

            expect(() => instance.registerHotkey(config2)).toThrow(
                'This app is trying to bind multiple actions to the hot keys: b',
            );
        });
    });

    describe('deregisterHotkey()', () => {
        let hotkeyConfigA: HotkeyConfig;
        let hotkeyConfigB: HotkeyConfig;
        let hotkeyConfigC: HotkeyConfig;

        beforeEach(() => {
            hotkeyConfigA = new HotkeyRecord({
                key: 'a',
            });
            hotkeyConfigB = new HotkeyRecord({
                key: 'b',
            });
            hotkeyConfigC = new HotkeyRecord({
                key: 'c',
            });
            instance.registerHotkey(hotkeyConfigA);
            instance.registerHotkey(hotkeyConfigB);
            instance.registerHotkey(hotkeyConfigC);
        });

        test('should remove hotkey config when called', () => {
            instance.deregisterHotkey(hotkeyConfigB);

            const { hotkeys } = instance;
            expect(hotkeys.size).toEqual(2);
            expect(hotkeys.includes(hotkeyConfigB)).toBe(false);
        });

        test('should report no error if asked to remove a config that is not registered', () => {
            const newConfig = new HotkeyRecord({
                key: 'd',
            });

            expect(() => instance.deregisterHotkey(newConfig)).not.toThrow();
        });
    });
});
