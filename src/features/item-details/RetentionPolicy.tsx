import * as React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Text } from '@box/blueprint-web';

import PlainButton from '../../components/plain-button';

import messages from './messages';

const datetimeOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
} as const;

type Props = {
    dispositionTime?: number;
    openModal?: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
    policyType?: string;
    retentionPolicyDescription?: string;
};

const RetentionPolicy = ({ dispositionTime, openModal, policyType, retentionPolicyDescription }: Props) => {
    if (!retentionPolicyDescription) {
        return null;
    }

    return (
        <>
            <dt>
                <Text as="span" variant="bodyDefaultSemibold">
                    <FormattedMessage {...messages.retentionPolicyDescription} />
                </Text>
            </dt>
            <dd>{retentionPolicyDescription}</dd>
            {policyType !== 'indefinite' ? (
                <>
                    <dt>
                        <Text as="span" variant="bodyDefaultSemibold">
                            <FormattedMessage {...messages.retentionPolicyExpiration} />
                        </Text>
                    </dt>
                    {dispositionTime ? (
                        <dd>
                            <FormattedDate value={new Date(dispositionTime)} {...datetimeOptions} />
                            {openModal ? (
                                <PlainButton
                                    className="lnk bdl-RetentionLink"
                                    data-target-id="PlainButton-retentionPolicyExtendButton"
                                    onClick={openModal}
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
