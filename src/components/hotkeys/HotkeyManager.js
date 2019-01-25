// @flow
class HotkeyManager {
    layerStack = [];

    setActiveLayer = (layerID: string) => {
        this.layerStack.push(layerID);
    };

    removeLayer = (layerID: string) => {
        // $FlowFixMe
        this.layerStack = this.layerStack.filter(thisLayerID => thisLayerID !== layerID);
    };

    getActiveLayerID = () => {
        if (this.layerStack.length === 0) {
            return null;
        }
        return this.layerStack[this.layerStack.length - 1];
    };
}

// This is a singleton service to maintain the global hotkey layer stack
export default new HotkeyManager();
