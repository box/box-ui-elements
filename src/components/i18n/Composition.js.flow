/*
 * Utility class for the FormattedCompMessage component.
 */
import * as React from 'react';
import { JSTYPE_BOOLEAN, JSTYPE_NUMBER, JSTYPE_OBJECT, JSTYPE_STRING } from './constants';

const MessageAccumulator = require('message-accumulator').default; // ES5 CommonJS module
const Node = require('ilib-tree-node').default; // ES5 CommonJS module

/**
 * @class Compose a tree of React elements into a single string.
 *
 * @param {React.Element} element the element to compose
 */
class Composition {
    constructor(element) {
        this.element = element;
        this.isComposed = false;

        this.ma = new MessageAccumulator();
        this.keyIndex = 0;
    }

    recompose(element) {
        switch (typeof element) {
            case JSTYPE_OBJECT:
                if (Array.isArray(element)) {
                    element.forEach(subelement => this.recompose(subelement));
                } else if (element) {
                    if (element.type === 'Param' || element.type.name === 'Param') {
                        this.ma.addParam(element);
                    } else {
                        this.ma.push(element);
                        React.Children.forEach(element.props.children, child => this.recompose(child));
                        this.ma.pop();
                    }
                }
                break;

            case JSTYPE_NUMBER:
            case JSTYPE_BOOLEAN:
                this.ma.addText(String(element));
                break;

            case JSTYPE_STRING:
                this.ma.addText(element);
                break;

            default:
                break;
        }
    }

    /**
     * Compose a tree of react elements to a string that can be translated.
     *
     * @return {string} a string representing the tree of react elements
     */
    compose() {
        this.index = 0;
        if (!this.isComposed) {
            this.recompose(this.element);
        }
        this.isComposed = true;
        return this.ma.getMinimalString();
    }

    /**
     * @private
     */
    nextKey() {
        const result = `key${this.keyIndex}`;
        this.keyIndex += 1;
        return result;
    }

    /**
     * @private
     */
    mapToReactElements(node) {
        if (!node) return '';

        let children = [];
        for (let i = 0; i < node.children.length; i += 1) {
            children.push(this.mapToReactElements(node.children[i]));
        }

        const el = node.extra;
        if (children.length === 0 && el && el.props) {
            const { temp } = el.props;
            children = temp;
        }

        if (children && children.length === 1 && typeof children[0] === 'string') {
            [children] = children;
        }

        if (el) {
            return children && children.length
                ? React.cloneElement(el, { key: el.key || this.nextKey() }, children)
                : React.cloneElement(el, { key: el.key || this.nextKey() });
        }
        if (children.length) {
            return children.length > 1 ? children : children[0];
        }

        return node.value || '';
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
        const translation = MessageAccumulator.create(string, this.ma);
        const nodeArray = [
            new Node({
                type: 'root',
                use: 'start',
            }),
        ]
            .concat(this.ma.getPrefix())
            .concat(translation.root.toArray().slice(1, -1))
            .concat(this.ma.getSuffix())
            .concat([
                new Node({
                    type: 'root',
                    use: 'end',
                }),
            ]);
        // convert to a tree again
        return this.mapToReactElements(Node.fromArray(nodeArray));
    }
}

export default Composition;
