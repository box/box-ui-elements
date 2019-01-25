import HotkeyManager from '../HotkeyManager';

describe('components/hotkeys/HotkeyManager', () => {
    describe('setActiveLayer()', () => {
        test('should add layer to stack', () => {
            HotkeyManager.setActiveLayer(123);

            expect(HotkeyManager.layerStack[0]).toBe(123);
        });
    });

    describe('removeLayer()', () => {
        test('should remove layer from stack', () => {
            HotkeyManager.layerStack = [123, 456, 789];

            HotkeyManager.removeLayer(456);

            expect(HotkeyManager.layerStack).toEqual([123, 789]);
        });
    });

    describe('getActiveLayerID()', () => {
        test('should return layer on the top of the stack', () => {
            HotkeyManager.layerStack = [123, 456, 789];

            expect(HotkeyManager.getActiveLayerID()).toBe(789);
        });
    });
});
