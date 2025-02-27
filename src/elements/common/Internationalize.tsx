/**
 * @file Wraps a component in an IntlProvider
 * @author Box
 */

import React, { Children, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { StringMap } from '../../common/types/core';

interface Props {
    children?: ReactNode;
    language?: string;
    messages?: StringMap;
}

const Internationalize = ({ language, messages, children }: Props): ReactNode => {
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
