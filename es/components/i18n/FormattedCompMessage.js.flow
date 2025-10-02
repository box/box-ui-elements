// @flow
// @deprecated, use FormattedMessage from react-intl v6 instead.
import * as React from 'react';
import { injectIntl } from 'react-intl';
import isNaN from 'lodash/isNaN';

import isDevEnvironment from '../../utils/env';
import { CATEGORY_ZERO, CATEGORY_ONE, CATEGORY_TWO, CATEGORY_FEW, CATEGORY_MANY, CATEGORY_OTHER } from './constants';
import Composition from './Composition';

type Props = {
    /**
     * The text to translate. This may be a string or JSX. The defaultMessage prop may be
     * given or the component may have children, but not both.
     */
    children?: React.Node,

    /**
     * Specify the pivot count to choose which plural form to use.
     * When specified, this FormattedCompMessage component will choose one of the
     * Plural elements in its children according to the value of this count
     * and the linguistic rules of the locale which determine which numbers
     * belong to which plural class.
     */
    count?: number,

    /**
     * The text to translate. This may be a string or JSX. This prop may be
     * given or the component may have children, but not both.
     */
    defaultMessage?: React.ElementType | string,

    /**
     * A description to send to the translators to explain the context of
     * this string.
     */
    description: string,

    /** The unique id of this string. */
    id: string,

    /**
     * The intl provider. This is injected into this component
     * via the injectIntl function from react-intl.
     */
    intl: Object,

    /**
     * Specify the name of the HTML tag you would like to use to wrap the
     * translations.
     */
    tagName: string,
};

type State = {
    composition: Composition,
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
    };

    constructor(props: Props) {
        super(props);

        /* eslint-disable no-console */
        console.warn(
            "box-ui-elements: the FormattedCompMessage component is deprecated! Use react-intl's FormattedMessage instead.",
        );
        /* eslint-enable no-console */

        // these parameters echo the ones in react-intl's FormattedMessage
        // component, plus a few extra
        const {
            defaultMessage, // The English string + HTML + components that you want translated
            count, // the pivot count to choose a plural form
            children, // the components within the body
        } = this.props;

        const sourceElements = defaultMessage || children;

        if (sourceElements) {
            const composition = new Composition(sourceElements);
            let source = '';

            if (!isNaN(Number(count))) {
                if (children) {
                    source = this.composePluralString(children);
                } else if (isDevEnvironment()) {
                    throw new Error('Cannot use count prop on a FormattedCompMessage component that has no children.');
                }
            } else {
                source = composition.compose();
            }

            this.state = {
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
            if (isDevEnvironment()) {
                throw new Error(
                    'Cannot use count prop on a FormattedCompMessage component without giving both a "one" and "other" Plural component in the children.',
                );
            }
        }
        // add these to the string in a particular order so that
        // we always end up with the same string regardless of
        // the order that the Plural elements were specified in
        // the source code
        const categoriesString = [
            CATEGORY_ZERO,
            CATEGORY_ONE,
            CATEGORY_TWO,
            CATEGORY_FEW,
            CATEGORY_MANY,
            CATEGORY_OTHER,
        ]
            .map(category => (categories[category] ? ` ${category} {${categories[category]}}` : ''))
            .join('');

        // see the intl-messageformat project for an explanation of this syntax
        return `{count, plural,${categoriesString}}`;
    }

    render() {
        const { count, tagName, intl, description, id, defaultMessage, ...rest } = this.props;
        const { composition, source } = this.state;
        const values = {};
        if (typeof count === 'number') {
            // make sure intl.formatMessage switches properly on the count
            values.count = count;
        }

        // react-intl will do the correct plurals if necessary
        const descriptor = {
            id,
            defaultMessage: source,
            description,
        };
        const translation = intl.formatMessage(descriptor, values);

        // always wrap the translated string in a tag to contain everything
        // and to give us a spot to record the id. The resource id is the
        // the id in mojito for the string. Having this attr has these advantages:
        // 1. When debugging i18n or translation problems, it is MUCH easier to find
        // the exact string to fix in Mojito rather than guessing. It might be useful
        // for general debugging as well to map from something you see in the UI to
        // the actual code that implements it.
        // 2. It can be used by an in-context linguistic review tool. The tool code
        // can contact mojito and retrieve the English for any translation errors that
        // the reviewer finds and submit translation tickets to Jira and/or fixed
        // translations directly back to Mojito.
        // 3. It can be used by the planned "text experiment framework" to identify
        // whole strings in the UI that can be A/B tested in various languages without
        // publishing new versions of the code.
        return React.createElement(
            tagName,
            {
                key: id,
                'x-resource-id': id,
                ...rest,
            },
            composition.decompose(translation),
        );
    }
}

export default injectIntl(FormattedCompMessage);
