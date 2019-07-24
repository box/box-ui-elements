// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../../../../components/tooltip';
import ReadableTime from '../../../../components/time/ReadableTime';
import messages from '../../../common/messages';

type Props = {
    date: number, // unix epoch timestamp (new Date().getTime())
};

const Timestamp = ({ date }: Props) => {
    return (
        <Tooltip text={<FormattedMessage {...messages.fullDateTime} values={{ time: date }} />}>
            <small className="bdl-Timestamp">
                <ReadableTime relativeThreshold={0} alwaysShowTime timestamp={date} />
            </small>
        </Tooltip>
    );
};

export default Timestamp;
