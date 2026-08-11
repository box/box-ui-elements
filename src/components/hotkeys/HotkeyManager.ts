class HotkeyManager {
    layerStack: string[] = [];

    setActiveLayer = (layerID: string): void => {
        this.layerStack.push(layerID);
    };

    removeLayer = (layerID: string): void => {
        this.layerStack = this.layerStack.filter(thisLayerID => thisLayerID !== layerID);
    };

    getActiveLayerID = (): string | null => {
        if (this.layerStack.length === 0) {
            return null;
        }
        return this.layerStack[this.layerStack.length - 1];
    };
}

// This is a singleton service to maintain the global hotkey layer stack
export default new HotkeyManager();
