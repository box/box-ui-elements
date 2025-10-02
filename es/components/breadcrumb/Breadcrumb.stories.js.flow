// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import Link from '../link/Link';
import IconHome from '../../icons/general/IconHome';

import Breadcrumb from './Breadcrumb';
import notes from './Breadcrumb.stories.md';

export const regular = () => (
    <IntlProvider locale="en">
        <Breadcrumb label="Breadcrumb">
            <IconHome />
            <Link href="#foo">Box Engineering</Link>
        </Breadcrumb>
    </IntlProvider>
);

export const withMultipleCrumbs = () => (
    <IntlProvider locale="en">
        <Breadcrumb label="Breadcrumb">
            <IconHome />
            <Link href="#foo">Box Engineering</Link>
            <Link href="#foo">Frameworks</Link>
            <Link href="#foo">Front End</Link>
            <Link href="#foo">React</Link>
            <Link href="#foo">Box React UI</Link>
        </Breadcrumb>
    </IntlProvider>
);

export default {
    title: 'Components/Breadcrumb',
    component: Breadcrumb,
    parameters: {
        notes,
    },
};
