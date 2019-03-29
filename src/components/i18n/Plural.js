// @flow
import * as React from 'react';
import { CATEGORY_ZERO, CATEGORY_ONE, CATEGORY_TWO, CATEGORY_FEW, CATEGORY_MANY, CATEGORY_OTHER } from './constants';

type Props = {
    /** The plural category this string. (required) */
    category: CATEGORY_ZERO | CATEGORY_ONE | CATEGORY_TWO | CATEGORY_FEW | CATEGORY_MANY | CATEGORY_OTHER,

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
export default function Plural(props: Props) {
    return props.children;
}
