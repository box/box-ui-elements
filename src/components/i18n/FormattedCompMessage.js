// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';

import Composition from './Composition';

type Props = {
    children: React.Node,
    /** The unique id of this string. (required) */
    count?: number,

    /**
     * A description to send to the translators to explain the context of
     * this string and to describe the type of any replacement parameters.
     * (required)
     */
    defaultMessage?: React.ElementType | string,

    /**
     * The text to translate. This may be a string or JSX. This prop may be
     * given or the component may have children, but not both.
     */
    description: string,

    /**
     * Specify the name of the HTML tag you would like to use to wrap the
     * translations. Default: "span"
     */
    id: string,

    /**
     * Specify the pivot count to choose which plural form to use.
     * When specified, this FormattedCompMessage component will choose one of the
     * Plural elements in its children according to the value of this count
     * and the linguistic rules of the locale which determine which numbers
     * belong to which plural class.
     */
    intl: Object,

    /**
     * An object which maps names to values to replace into the text
     * after the translation is done.
     */
    tagName?: string,
    values?: Object,
};

type State = {
    composition: Composition,
    id: string,
    source: string,
};

/**
 * Replace the text inside of this component with a translation. This
 * component is built on top of react-intl, so it works along with the
 * regular react-intl components and objects you are used to, and it gets
 * its translations from react intl as well. The FormattedCompMessage component can
 * be used wherever it is valid to put JSX text. In regular Javascript
 * code, you should continue to use the intl.formatMessage() call and
 * extract your strings into a message.js file.
 */
class FormattedCompMessage extends React.Component<Props, State> {
    composition: Composition;

    str: string;

    static defaultProps = {
        tagName: 'span',
        values: {},
    };

    constructor(props: Props) {
        super(props);

        // these parameters echo the ones in react-intl's FormattedMessage
        // component, plus a few extra
        const {
            id, // the unique id of the string
            defaultMessage, // The English string + HTML + components that you want translated
            description, // An explanation of the message for the translators
            count, // the pivot count to choose a plural form
            children, // the components within the body
        } = this.props;

        const sourceElements = defaultMessage || children;

        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
            if (!id) {
                throw new Error('The id property is required on a FormattedCompMessage component.');
            }

            if (!description) {
                throw new Error('The description property is required on a FormattedCompMessage component.');
            }
        }

        if (sourceElements) {
            const composition = new Composition(sourceElements);
            let source = '';

            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(Number(count))) {
                if (children) {
                    source = this.composePluralString(children);
                } else if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
                    throw new Error('Cannot use count prop on a FormattedCompMessage component that has no children.');
                }
            } else {
                source = composition.compose();
            }

            this.state = {
                id,
                source,
                composition,
            };
        }
    }

    /**
     * Search for any Plural elements in the children, and
     * then construct the English source string in the correct
     * format for react-intl to use for pluralization
     * @param {React.Element} children the children of this node
     * @return {string} the composed plural string
     */
    composePluralString(children) {
        const categories = {};
        React.Children.forEach(children, child => {
            if (typeof child === 'object' && React.isValidElement(child) && child.type.name === 'Plural') {
                const childComposition = new Composition(child.props.children);
                categories[child.props.category] = childComposition.compose();
            }
        });
        if (!categories.one || !categories.other) {
            if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
                throw new Error(
                    'Cannot use count prop on a FormattedCompMessage component without giving both a "one" and "other" Plural component in the children.',
                );
            }
        }
        // add these to the string in a particular order so that
        // we always end up with the same string regardless of
        // the order that the Plural elements were specified in
        // the source code
        const categoriesString = ['zero', 'one', 'two', 'few', 'many', 'other']
            .map(category => (categories[category] ? ` ${category} {${categories[category]}}` : ''))
            .join('');

        // see the intl-messageformat project for an explanation of this syntax
        return `{count, plural,${categoriesString}}`;
    }

    emptyTag(name) {
        return `<${name}></${name}>`;
    }

    /**
     * Substitute the values into a composed translation.
     * @param {string} translation the string to substitute values into
     * @param {Object} values an object containing values to substitute
     * into the string
     * @return {string} the updated string
     */
    substitute(translation, values) {
        // now do the substitutions in the post-translated string
        let functionIndex = 0;
        let elementIndex = 0;
        let name;
        let value;

        if (values) {
            Object.keys(values).forEach(property => {
                const re = new RegExp(`\\[\\[${property}\\]\\]`, 'g');
                switch (typeof values[property]) {
                    case 'function':
                        value = values[property]();
                        // "f" for "function" result
                        name = `f${functionIndex}`;
                        functionIndex += 1;
                        this.state.composition.addElement(name, value);
                        translation = translation.replace(re, this.emptyTag(name));
                        break;
                    case 'object':
                        if (values[property] === null) {
                            translation = translation.replace(re, '');
                        } else if (React.isValidElement(values[property])) {
                            // "e" for react "element"
                            name = `e${elementIndex}`;
                            elementIndex += 1;
                            this.state.composition.addElement(name, values[property]);
                            translation = translation.replace(re, this.emptyTag(name));
                        } else {
                            translation = translation.replace(re, values[property].toString());
                        }
                        break;
                    default:
                        translation = translation.replace(
                            re,
                            typeof values[property] !== 'undefined' ? values[property].toString() : '',
                        );
                        break;
                }
            });
        }

        return translation;
    }

    render() {
        const { count, tagName, intl, description } = this.props;
        const { composition, id, source } = this.state;
        let { values } = this.props;
        if (typeof count === 'number') {
            // make sure we can format in the count as well
            values = { count, ...values };
        }

        // react-intl will do the correct plurals if necessary
        let translation = intl.formatMessage(
            {
                id,
                defaultMessage: source,
                description,
            },
            values,
        );

        // finally, do the substitution of the values into the translated
        // and post-pluralized string
        if (values) {
            translation = this.substitute(translation, values);
        }

        // always wrap the translated string in a tag to contain everything
        // and to give us a spot to record the id
        return React.createElement(
            tagName || 'span',
            {
                key: id,
                'x-resource-id': id,
            },
            composition.decompose(translation),
        );
    }
}

export default injectIntl(FormattedCompMessage);
