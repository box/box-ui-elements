// @flow
/**
 * Wrapper component for styleguidist examples
 */
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import './styles/styles.scss';

type Props = {
    children: React.Node,
};

const Wrapper = ({ children }: Props) => <IntlProvider locale="en">{children}</IntlProvider>;

export default Wrapper;
