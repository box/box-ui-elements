// @flow
// @deprecated, use FormattedPlural from react-intl v6 instead.
import * as React from 'react';

type Props = {
    /** The plural category this string. (required) */
    category:
        | 'zero'
        | 'one'
        | 'two'
        | 'few'
        | 'many'
        | 'other'
        | '=0'
        | '=1'
        | '=2'
        | '=3'
        | '=4'
        | '=5'
        | '=6'
        | '=7'
        | '=8'
        | '=9'
        | '=10'
        | '=11'
        | '=12'
        | '=13'
        | '=14'
        | '=15'
        | '=16'
        | '=17'
        | '=18'
        | '=19',

    children: React.Node,
};

/**
 * @class Encloses a plural string for a particular plural category.
 *
 * The categories for English are "one" for singular and "other" for plural. Both are
 * required when writing plurals with the FormattedCompMessage component in source code.<p>
 *
 * This component does not add any functionality beyond its contents, and its only
 * purpose is to enclose some JSX to use for a particular plural category.
 *
 * See the [Unicode CLDR description of plural category
 * rules](http://cldr.unicode.org/index/cldr-spec/plural-rules) for more details.
 */
const Plural = ({ children }: Props) => {
    /* eslint-disable no-console */
    console.warn("box-ui-elements: the Plural component is deprecated! Use react-intl's FormattedPlural instead.");
    /* eslint-enable no-console */

    return children;
};

export default Plural;
