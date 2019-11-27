// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import { ANONYMOUS_USER_ID } from './constants';

type Props = {
    email?: string,
    id: string,
    name?: string,
};

const FormattedUser = ({ email, id, name }: Props) => {
    const { anonymousUser, invalidUserError: unknownUser } = messages;

    let targetUser = <FormattedMessage {...unknownUser} />;
    let targetUserInfo = `(${email || id})`;

    if (id === ANONYMOUS_USER_ID) {
        targetUser = <FormattedMessage {...anonymousUser} />;
        targetUserInfo = '';
    } else if (name) {
        targetUser = name;
        targetUserInfo = `(${email || id})`;
    } else if (email) {
        targetUser = id;
        targetUserInfo = `(${email || id})`;
    }

    const formattedUser = (
        <>
            {targetUser}
            {targetUserInfo ? ` ${targetUserInfo}` : ''}
        </>
    );
    return formattedUser;
};

export default FormattedUser;
