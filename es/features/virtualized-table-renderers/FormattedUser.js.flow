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

const formatUser = ({ email, id, name }: Props, intl?: any, isComponent: boolean = false) => {
    const { anonymousUser, unknownUser } = messages;

    let targetUser = isComponent || !intl ? <FormattedMessage {...unknownUser} /> : intl.formatMessage(unknownUser);
    let targetUserInfo = `(${email || id})`;

    if (id === ANONYMOUS_USER_ID) {
        targetUser = isComponent || !intl ? <FormattedMessage {...anonymousUser} /> : intl.formatMessage(anonymousUser);
        targetUserInfo = '';
    } else if (name) {
        targetUser = name;
        targetUserInfo = `(${email || id})`;
    } else if (email) {
        targetUser = id;
        targetUserInfo = `(${email || id})`;
    }

    const formattedUser = isComponent ? (
        <>
            {targetUser}
            {targetUserInfo ? ` ${targetUserInfo}` : ''}
        </>
    ) : (
        `${String(targetUser)} ${targetUserInfo}`.trim()
    );
    return formattedUser;
};

const FormattedUser = (props: Props) => formatUser(props, undefined, true);

export { formatUser };
export default FormattedUser;
