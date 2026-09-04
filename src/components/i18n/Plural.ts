// @deprecated, use FormattedPlural from react-intl v6 instead.
import * as React from 'react';

export interface PluralProps {
    /** The plural category for this string */
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
        | '=19';
    /** The content associated with the plural category */
    children: React.ReactNode;
}

/**
 * Groups content for a plural category within FormattedCompMessage.
 *
 * See [Unicode CLDR plural rules](http://cldr.unicode.org/index/cldr-spec/plural-rules).
 */
const Plural = ({ children }: PluralProps): React.ReactNode => {
    /* eslint-disable no-console */
    console.warn("box-ui-elements: the Plural component is deprecated! Use react-intl's FormattedPlural instead.");
    /* eslint-enable no-console */

    return children;
};

export default Plural;
