/**
 * @flow
 * @file Base class for the Box UI Elements ES6 wrapper
 * @author Box
 */

/* eslint-disable */
import localeData from 'i18n-locale-data'; // this is a webpack alias
import EventEmitter from 'events';
import { IntlProvider, addLocaleData } from 'react-intl';
import { unmountComponentAtNode } from 'react-dom';
/* eslint-enable */
import { DEFAULT_CONTAINER } from '../constants';
import messages from '../messages';
import type { StringMap } from '../flowTypes';

declare var __LOCALE__: string;
declare var __VERSION__: string;
declare var __TRANSLATIONS__: StringMap;

class ES6Wrapper extends EventEmitter {
    /**
     * @property {Function}
     */
    emit: Function;

    /**
     * @property {HTMLElement}
     */
    container: ?HTMLElement;

    /**
     * @property {string}
     */
    root: string;

    /**
     * @property {string}
     */
    token: string;

    /**
     * @property {string}
     */
    options: { [key: string]: any };

    /**
     * @property {string}
     */
    locale: string = __LOCALE__;

    /**
     * @property {string}
     */
    translations: StringMap = __TRANSLATIONS__;

    /**
     * @property {Object}
     */
    intl: any;

    /**
     * @property {Element}
     */
    component: any;

    /**
     * [constructor]
     *
     * @private
     * @return {ES6Wrapper}
     */
    constructor() {
        super();
        addLocaleData(localeData);
        this.intl = new IntlProvider({ locale: this.locale, messages: this.translations }, {}).getChildContext().intl;
    }

    /**
     * Uses react intl to format messages
     *
     * @public
     * @param {string} id - The message id.
     * @param {Object|undefined} [replacements] - Optional replacements.
     * @return {string}
     */
    getLocalizedMessage = (id: string, replacements: ?StringMap = {}): string => {
        if (!messages[id]) {
            unmountComponentAtNode(this.container);
            throw new Error(`Cannot get localized message for ${id}`);
        }
        const message: string = this.intl.formatMessage(messages[id], replacements);
        if (!message) {
            unmountComponentAtNode(this.container);
            throw new Error(`Cannot get localized message for ${id}`);
        }
        return message;
    };

    /**
     * Shows the content picker.
     *
     * @public
     * @param {string} root The root folder id.
     * @param {string} token The API access token.
     * @param {Object|void} [options] Optional options.
     * @return {void}
     */
    show(root: string, token: string, options: { [key: string]: any } = {}): void {
        this.root = root;
        this.token = token;
        this.options = options;
        this.options.version = __VERSION__;
        this.emit = this.emit.bind(this);
        const container = options.container || DEFAULT_CONTAINER;
        this.container = container instanceof HTMLElement ? container : document.querySelector(container);
        this.render();
    }

    /**
     * Hides the content picker.
     * Removes all event listeners.
     * Clears out the DOM inside container.
     *
     * @public
     * @return {void}
     */
    hide(): void {
        this.removeAllListeners();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * Renders the component.
     * Should be overriden.
     *
     * @protected
     * @return {void}
     */
    render() {
        throw new Error('Unimplemented!');
    }

    /**
     * Sets reference to the inner component
     *
     * @protected
     * @return {void}
     */
    setComponent = (component: any) => {
        this.component = component;
    };

    /**
     * Gets reference to the inner component
     *
     * @public
     * @return {Element}
     */
    getComponent(): any {
        return this.component;
    }

    /**
     * Clears out the cache used by the component
     *
     * @public
     * @return {Element}
     */
    clearCache(): void {
        const component = this.getComponent();
        if (component && typeof component.clearCache === 'function') {
            component.clearCache();
        }
    }
}

export default ES6Wrapper;
