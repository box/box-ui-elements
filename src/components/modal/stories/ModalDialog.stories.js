// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import ModalDialog from '../ModalDialog';
import notes from './ModalDialog.stories.md';

export const basic = () => (
    <IntlProvider locale="en">
        <ModalDialog title="Static ModalDialog">
            <p>I can be rendered statically! Because I’m not in a portal!</p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue, lacus ut scelerisque
                porttitor, libero diam luctus ante, non porta lectus dolor eu lectus. Suspendisse sagittis ut orci eget
                placerat.
            </p>
        </ModalDialog>
    </IntlProvider>
);

export default {
    title: 'Components/ModalDialog',
    component: ModalDialog,
    parameters: {
        notes,
    },
};
