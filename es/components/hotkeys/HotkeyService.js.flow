import { OrderedMap, OrderedSet } from 'immutable';
import Mousetrap from 'mousetrap';
import uniqueId from 'lodash/uniqueId';

import HotkeyManager from './HotkeyManager';

// An instance of this class represents one hotkey "layer"
class HotkeyService {
    constructor() {
        // create a fake HTML element to grab the event listener from mousetrap.
        // hacky, but mousetrap unfortunately doesn't expose this handler :(
        this.mousetrap = new Mousetrap({
            addEventListener: (type, callback) => {
                this.mousetrapEventHandler = event => {
                    if (HotkeyManager.getActiveLayerID() !== this.layerID) {
                        return;
                    }
                    // event should not propagate past this layer, no matter what
                    event.stopPropagation();
                    callback(event);
                };
            },
        });
        this.reset();

        this.layerID = uniqueId('hotkey-layer');
        HotkeyManager.setActiveLayer(this.layerID);

        window.addEventListener('keypress', this.mousetrapEventHandler);
        window.addEventListener('keydown', this.mousetrapEventHandler);
        window.addEventListener('keyup', this.mousetrapEventHandler);
    }

    destroyLayer() {
        HotkeyManager.removeLayer(this.layerID);
        window.removeEventListener('keypress', this.mousetrapEventHandler);
        window.removeEventListener('keydown', this.mousetrapEventHandler);
        window.removeEventListener('keyup', this.mousetrapEventHandler);
    }

    reset() {
        // Use an ordered collection since we ultimately display keys in the order they were added
        this.hotkeys = new OrderedMap();
        this.mousetrap.reset();
    }

    getActiveHotkeys() {
        // Sort hotkeys into buckets by "type"
        return this.hotkeys.toOrderedSet().reduce((hotkeys, hotkey) => {
            const { type } = hotkey;
            if (!type) {
                return hotkeys;
            }
            if (!(type in hotkeys)) {
                hotkeys[type] = [];
            }
            hotkeys[type].push(hotkey);
            return hotkeys;
        }, {});
    }

    getActiveTypes() {
        // Get "types" of hotkeys in sorted order, by first hotkey
        // e.g. if the current layer has:
        // [
        //     { key: 'shift+a', type: 'File Selection' },
        //     { key: 'shift+g+a', type: 'Navigation' },
        //     { key: 'shift+x', type: 'File Selection' },
        // ]
        // then this function would output [ 'File Selection', 'Navigation' ].
        // Used to help generate the hotkey help modal menu options.
        return this.hotkeys.reduce((types, { type }) => (type ? types.add(type) : types), new OrderedSet()).toJS();
    }

    registerHotkey(hotkeyConfig) {
        const { key, handler } = hotkeyConfig;
        const keys = Array.isArray(key) ? key : [key];
        const badKeys = keys.filter(candidate => this.hotkeys.has(candidate));
        const existingConfig = this.hotkeys.get(keys[0]);

        // Ignore the whole config if it has already been registered
        if (existingConfig === hotkeyConfig) {
            return;
        }

        // If any of the keys are being used by another config, abort rudely.
        if (badKeys.length !== 0) {
            throw new Error(`This app is trying to bind multiple actions to the hot keys: ${badKeys}.`);
        }

        this.mousetrap.bind(keys, handler);
        keys.forEach(keyBinding => {
            this.hotkeys = this.hotkeys.set(keyBinding, hotkeyConfig);
        });
    }

    deregisterHotkey(hotkeyConfig) {
        const { key } = hotkeyConfig;
        const keys = Array.isArray(key) ? key : [key];

        keys.forEach(keyBinding => {
            this.hotkeys = this.hotkeys.delete(keyBinding);
        });
        this.mousetrap.unbind(keys);
    }
}

export default HotkeyService;
