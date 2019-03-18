// @flow
import * as React from 'react';
import Composition from './Composition';

export const CATEGORY_ZERO: 'zero' = 'zero';
export const CATEGORY_ONE: 'one' = 'one';
export const CATEGORY_TWO: 'two' = 'two';
export const CATEGORY_FEW: 'few' = 'few';
export const CATEGORY_MANY: 'many' = 'many';
export const CATEGORY_OTHER: 'other' = 'other';

type Props = {
    /** The plural category this string. (required) */
    category:
        | typeof CATEGORY_ZERO
        | typeof CATEGORY_ONE
        | typeof CATEGORY_TWO
        | typeof CATEGORY_FEW
        | typeof CATEGORY_MANY
        | typeof CATEGORY_OTHER,

    children: React.Node,
};

/**
 * @class Encloses a plural string for a particular plural category.
 *
 * The categories for English are "one" for singular and "other" for plural. Both are
 * required when writing plurals with the Translate component.<p>
 *
 * This component does not add any functionality beyond its contents, and its only
 * purpose is to enclose some JSX to use for a particular plural category.
 *
 * See the [Unicode CLDR description of plural category
 * rules](http://cldr.unicode.org/index/cldr-spec/plural-rules) for more details.
 */
class Plural extends React.Component<Props> {
    // mostly for unit testing
    getSourceString() {
        const composition = new Composition(this.props.children);
        return composition.compose();
    }

    render() {
        return this.props.children;
    }
}

export default Plural;
