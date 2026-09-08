import * as React from 'react';
import MessageAccumulator from 'message-accumulator';
import Node from 'ilib-tree-node';

import { JSTYPE_BOOLEAN, JSTYPE_NUMBER, JSTYPE_OBJECT, JSTYPE_STRING } from './constants';

interface CompositionNode {
    children: CompositionNode[];
    extra?: React.ReactElement<{
        children?: React.ReactNode;
        temp?: React.ReactNode | React.ReactNode[];
    }>;
    value?: React.ReactNode;
}

interface MessageAccumulatorInstance {
    addParam: (element: React.ReactElement) => void;
    addText: (text: string) => void;
    getMinimalString: () => string;
    getPrefix: () => CompositionNode[];
    getSuffix: () => CompositionNode[];
    pop: () => void;
    push: (element: React.ReactElement) => void;
}

type ComposableElement = React.ReactNode | React.ElementType;

/** @class Compose a tree of React elements into a single string. */
class Composition {
    element: ComposableElement;

    isComposed: boolean;

    ma: MessageAccumulatorInstance;

    keyIndex: number;

    constructor(element?: ComposableElement) {
        this.element = element;
        this.isComposed = false;

        this.ma = new MessageAccumulator();
        this.keyIndex = 0;
    }

    recompose(element: ComposableElement): void {
        switch (typeof element) {
            case JSTYPE_OBJECT:
                if (Array.isArray(element)) {
                    element.forEach(subelement => this.recompose(subelement));
                } else if (element) {
                    const reactElement = element as React.ReactElement<{ children?: React.ReactNode }>;
                    const elementType = reactElement.type;
                    const elementName =
                        typeof elementType === 'string' ? undefined : (elementType as { name?: string }).name;
                    if (elementType === 'Param' || elementName === 'Param') {
                        this.ma.addParam(reactElement);
                    } else {
                        this.ma.push(reactElement);
                        React.Children.forEach(reactElement.props.children, child => this.recompose(child));
                        this.ma.pop();
                    }
                }
                break;

            case JSTYPE_NUMBER:
            case JSTYPE_BOOLEAN:
                this.ma.addText(String(element));
                break;

            case JSTYPE_STRING:
                this.ma.addText(element as string);
                break;

            default:
                break;
        }
    }

    /** Compose a tree of react elements to a string that can be translated. */
    compose(): string {
        if (!this.isComposed) {
            this.recompose(this.element);
        }
        this.isComposed = true;
        return this.ma.getMinimalString();
    }

    nextKey(): string {
        const result = `key${this.keyIndex}`;
        this.keyIndex += 1;
        return result;
    }

    mapToReactElements(node?: CompositionNode): React.ReactNode {
        if (!node) return '';

        let children: React.ReactNode | React.ReactNode[] = node.children.map(child => this.mapToReactElements(child));

        const el = node.extra;
        if (Array.isArray(children) && children.length === 0 && el?.props) {
            const { temp } = el.props;
            children = temp;
        }

        const childrenWithLength = children as React.ReactNode[] | string;
        if (childrenWithLength?.length === 1 && typeof childrenWithLength[0] === 'string') {
            children = childrenWithLength[0];
        }

        const normalizedChildren = children as React.ReactNode[] | string;
        if (el) {
            return normalizedChildren?.length
                ? React.cloneElement(el, { key: el.key || this.nextKey() }, children)
                : React.cloneElement(el, { key: el.key || this.nextKey() });
        }

        if (normalizedChildren.length) {
            return normalizedChildren.length > 1 ? children : normalizedChildren[0];
        }

        return node.value || '';
    }

    /**
     * Convert a composed string back into an array of React elements. The elements are clones of
     * the same ones that this composition was created with, so that they have the same type and
     * props and such as the originals. The elements may be re-ordered from the original, however,
     * if the grammar of the target language requires moving around text, HTML tags, or
     * subcomponents.
     */
    decompose(string: string): React.ReactNode {
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
