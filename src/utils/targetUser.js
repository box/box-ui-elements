// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import commonMessages from '../common/messages';
import { ANONYMOUS_USER_ID } from '../constants';

type Props = {
    email?: string,
    id: string,
    name?: string,
};

const formatTargetUser = ({ email, id, name }: Props) => {
    let targetUser;
    let targetUserInfo;
    const { anonymousUser, invalidUserError: unknownUser } = commonMessages;
    if (id === ANONYMOUS_USER_ID) {
        targetUser = <FormattedMessage {...anonymousUser} />;
        targetUserInfo = '';
    } else if (name) {
        targetUser = name;
        targetUserInfo = `(${email || id})`;
    } else if (email) {
        targetUser = id;
        targetUserInfo = `(${email || id})`;
    } else {
        targetUser = <FormattedMessage {...unknownUser} />;
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

// eslint-disable-next-line import/prefer-default-export
export { formatTargetUser };
