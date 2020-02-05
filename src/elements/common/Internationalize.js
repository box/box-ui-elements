/**
 * @flow
 * @file Wraps a component in an IntlProvider
 * @author Box
 */

import React, { Children } from 'react';
import { IntlProvider } from 'react-intl';
import type { StringMap } from '../../common/types/core';

type Props = {
    children?: any,
    language?: string,
    messages?: StringMap,
};

const Internationalize = ({ language, messages, children }: Props) => {
    const shouldInternationalize: boolean = !!language && !!messages;

    if (shouldInternationalize) {
        return (
            <IntlProvider locale={language} messages={messages}>
                {children}
            </IntlProvider>
        );
    }

    return Children.only(children);
};

export default Internationalize;
