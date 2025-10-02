// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import Button from '../../button/Button';
import ModalDialog from '../ModalDialog';
import PrimaryButton from '../../primary-button/PrimaryButton';

import ModalActions from '../ModalActions';
import notes from './ModalActions.stories.md';

export const basic = () => (
    <IntlProvider locale="en">
        <ModalDialog title="Alert ModalDialog" type="alert">
            This is the alert message. It will automatically be wrapped in a paragraph tag.
            <ModalActions>
                <Button>Cancel</Button>
                <PrimaryButton>Okay</PrimaryButton>
            </ModalActions>
        </ModalDialog>
    </IntlProvider>
);

export default {
    title: 'Components/ModalActions',
    component: ModalActions,
    parameters: {
        notes,
    },
};
