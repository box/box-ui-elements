/*
 * Utility class for the FormattedCompMessage component.
 */
import React from 'react';

/**
 * @class Compose a tree of React elements into a single string.
 *
 * @param {React.Element} element the element to compose
 */
class Composition {
    constructor(element) {
        this.element = element;
        this.isComposed = false;
        this.mapping = {};
    }

    recompose(element) {
        let value;

        if (typeof element === 'object') {
            if (Array.isArray(element)) {
                value = element.map(subelement => this.recompose(subelement)).join('');
            } else if (element === null || !element.type) {
                value = '';
            } else {
                // "c" is for "component", that's good enough for me
                const name = `c${this.index}`;
                this.index += 1;
                let { children } = element.props;
                if (children) {
                    children = typeof children === 'string' ? [children] : children;
                    children = children.map(child => this.recompose(child));
                } else {
                    children = '';
                }
                value = [`<${name}>`, ...children, `</${name}>`].join('');
                this.mapping[name] = element;
            }
        } else {
            value = (typeof element !== 'undefined' && String(element)) || '';
        }
        return value;
    }

    /**
     * Compose a tree of react elements to a string that can be translated.
     *
     * @return {string} a string representing the tree of react elements
     */
    compose() {
        this.index = 0;
        const ret = this.recompose(this.element);
        this.isComposed = true;
        return ret;
    }

    /**
     * Return the react element with the given name.
     *
     * @param {string} name the name of the element being sought
     * @return {React.Element} the element with the given name
     */
    getElement(name) {
        return this.mapping[name];
    }

    /**
     * Add a mapping from a name to a react element.
     *
     * @param {string} name the name of the element being added
     * @param {React.Element} value the react element being added
     */
    addElement(name, value) {
        this.mapping[name] = value;
    }

    parse(string) {
        let match;
        const re = /(<([cef]\d+)>.*<\/\2>)/g;
        const first = /^<([cef]\d+)>/;

        const parts = string.split(re);
        const children = [];

        for (let i = 0; i < parts.length; i += 1) {
            first.lastIndex = 0;
            match = first.exec(parts[i]);
            if (match !== null) {
                const name = match[1];
                const len = match[0].length;
                // strip off the outer tags before processing the stuff in the middle
                const substr = parts[i].substring(len, parts[i].length - len - 1);
                const subchildren = this.parse(substr);
                const el = this.mapping[name];
                switch (typeof el) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                        children.push(el.toString());
                        break;

                    case 'function':
                    case 'object':
                        children.push(
                            React.cloneElement(
                                el,
                                { key: el.key || name },
                                subchildren || (el.props && el.props.children),
                            ),
                        );
                        break;

                    default:
                        // ignore null or undefined elements
                        break;
                }
                i += 1; // skip the number in the next iteration
            } else if (parts[i] && parts[i].length) {
                // don't store empty strings
                children.push(parts[i]);
            }
        }

        let ret = null;
        if (children && children.length) {
            ret = children.length === 1 ? children[0] : children;
        }
        return ret;
    }

    /**
     * Convert a composed string back into an array of React elements. The elements are clones of
     * the same ones that this composition was created with, so that they have the same type and
     * props and such as the originals. The elements may be re-ordered from the original, however,
     * if the grammar of the target language requires moving around text, HTML tags, or
     * subcomponents.
     *
     * @param {string} string the string to decompose into a tree of React elements.
     * @return {React.Element} a react element
     */
    decompose(string) {
        if (!this.isComposed) {
            // need to create the mapping first from names to react elements
            this.compose();
        }
        return this.parse(string);
    }
}

export default Composition;
