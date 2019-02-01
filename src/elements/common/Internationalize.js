/**
 * @flow
 * @file Wraps a component in an IntlProvider
 * @author Box
 */

import React, { Children } from 'react';
import { IntlProvider } from 'react-intl';

type Props = {
    children?: any,
    language?: string,
    messages?: StringMap,
};

const Internationalize = ({ language, messages, children }: Props) => {
    const shouldInternationalize: boolean = !!language && !!messages;

    if (shouldInternationalize) {
        const locale = language && language.substr(0, language.indexOf('-'));
        return (
            <IntlProvider locale={locale} messages={messages}>
                {children}
            </IntlProvider>
        );
    }

    return Children.only(children);
};

export default Internationalize;
