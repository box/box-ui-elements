import * as React from 'react';
import './AdditionalTabs.scss';
import PlainButton from '../../../components/plain-button/PlainButton';
import IconEllipsis from '../../../icons/general/IconEllipsis';

const MoreTabLoading = () => {
    return (
        <PlainButton className="bcs-additional-tab-loading-btn" type="button" isDisabled>
            <IconEllipsis className="bcs-additional-tab-more-icon" />
        </PlainButton>
    );
};

export default MoreTabLoading;
