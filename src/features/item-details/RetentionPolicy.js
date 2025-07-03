/* @flow */
import * as React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import PlainButton from '../../components/plain-button';

import messages from './messages';

const datetimeOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
};

type Props = {
    dispositionTime?: number,
    openModal?: Function,
    policyType?: string,
    retentionPolicyDescription?: string,
};

const RetentionPolicy = ({ dispositionTime, openModal, policyType, retentionPolicyDescription }: Props) => {
    if (!retentionPolicyDescription) {
        return null;
    }

    return (
        <>
            <FormattedMessage tagName="dt" {...messages.retentionPolicyDescription} />
            <dd>{retentionPolicyDescription}</dd>
            {policyType !== 'indefinite' ? (
                <>
                    <FormattedMessage tagName="dt" {...messages.retentionPolicyExpiration} />
                    {dispositionTime ? (
                        <dd>
                            <FormattedDate value={new Date(dispositionTime)} {...datetimeOptions} />
                            {openModal ? (
                                <PlainButton
                                    className="lnk bdl-RetentionLink"
                                    onClick={openModal}
                                    data-target-id="PlainButton-retentionPolicyExtendButton"
                                >
                                    <FormattedMessage {...messages.retentionPolicyExtend} />
                                </PlainButton>
                            ) : null}
                        </dd>
                    ) : null}
                </>
            ) : null}
        </>
    );
};

export default RetentionPolicy;
