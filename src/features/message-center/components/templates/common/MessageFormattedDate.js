// @flow
import * as React from 'react';
import { FormattedDate } from 'react-intl';

type Props = {| date: Date |};

function MessageFormattedDate({ date }: Props) {
    return <FormattedDate day="numeric" month="short" value={date} year="numeric" />;
}

export default MessageFormattedDate;
