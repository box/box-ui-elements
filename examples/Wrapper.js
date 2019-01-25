// @flow
/**
 * Wrapper component for styleguidist examples
 */
// $FlowFixMe
import 'core-js'; // For IE11
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import './styles/styles.scss';

type Props = {
    children: React.Node,
};

const Wrapper = ({ children }: Props) => (
    <IntlProvider locale="en" textComponent={React.Fragment}>
        {children}
    </IntlProvider>
);

export default Wrapper;
