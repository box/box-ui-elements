import * as React from 'react';
import PlainButton from '../../../components/plain-button/PlainButton';

const AdditionalTabLoading = () => {
    return (
        <PlainButton className="bcs-additional-tab-loading-btn" type="button" isDisabled>
            <div className="bcs-additional-tab-icon bcs-additional-tab-loading-content" />
        </PlainButton>
    );
};

export default AdditionalTabLoading;
