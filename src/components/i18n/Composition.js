/*
 * Utility class for the FormattedCompMessage component.
 */
import React from 'react';
import * as MA from 'message-accumulator';
import * as N from 'ilib-tree-node';
import { JSTYPE_BOOLEAN, JSTYPE_NUMBER, JSTYPE_OBJECT, JSTYPE_STRING } from '../../constants';

const MessageAccumulator = MA.default;
const Node = N.default;

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
    }

    recompose(element) {
        switch (typeof element) {
            case JSTYPE_OBJECT:
                if (Array.isArray(element)) {
                    element.forEach(subelement => this.recompose(subelement));
                } else if (element) {
                    if (element.type === 'Param') {
                        this.ma.addParam(element);
                    } else {
                        this.ma.push(element);

                        let { children } = element.props;
                        if (children) {
                            children = !Array.isArray(children) ? [children] : children;
                            children.forEach(child => this.recompose(child));
                        }
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
    mapToReactElements(node) {
        if (!node) return '';

        let children = [];
        for (let i = 0; i < node.children.length; i += 1) {
            children.push(this.mapToReactElements(node.children[i]));
        }

        const el = node.extra;
        if (children.length === 0 && el && el.props) {
            children = el.props.children;
        }

        if (children && children.length === 1 && typeof children[0] === 'string') {
            children = children[0];
        }

        if (el) {
            return React.cloneElement(el, { key: el.key }, children);
        }
        if (children.length) {
            return children;
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
        const nodeArray = this.ma
            .getPrefix()
            .concat(translation.root.toArray().slice(1, -1))
            .concat(this.ma.getSuffix());
        // convert to a tree again
        return this.mapToReactElements(Node.fromArray(nodeArray));
    }
}

export default Composition;
