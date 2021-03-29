import * as React from 'react';
import { MessageDescriptor } from 'react-intl';
// @ts-ignore flow import
import ActivityTimestamp from '../common/activity-timestamp';
import AnnotationActivityLink from './AnnotationActivityLink';
import './AnnotationActivityTimestamp.scss';

type Props = {
    date: number;
    id: string;
    isDisabled?: boolean;
    message: MessageDescriptor;
    onAnnotationSelect: () => void;
};

const AnnotationActivityTimestamp = ({
    date,
    id,
    isDisabled = false,
    message,
    onAnnotationSelect,
    ...rest
}: Props): JSX.Element => (
    <div className="bcs-AnnotationActivityTimestamp" {...rest}>
        <ActivityTimestamp date={date} />
        <AnnotationActivityLink id={id} isDisabled={isDisabled} message={message} onClick={onAnnotationSelect} />
    </div>
);

export default AnnotationActivityTimestamp;
