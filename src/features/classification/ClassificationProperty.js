// @deprecated

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../components/plain-button';

import ClassificationBadge from './ClassificationBadge';
import messages from './messages';

const ClassificationProperty = ({ openModal, tooltip, value }) => {
    if (!openModal && !value) {
        return null;
    }

    return (
        <React.Fragment>
            <FormattedMessage tagName="dt" {...messages.classification} />
            <dd>
                {value ? (
                    <div className="mbs">
                        <ClassificationBadge tooltip={tooltip} tooltipPosition="middle-left" value={value} />
                    </div>
                ) : null}
                {openModal ? (
                    <PlainButton className="lnk" onClick={openModal}>
                        <FormattedMessage {...messages[value ? 'edit' : 'addClassification']} />
                    </PlainButton>
                ) : null}
            </dd>
        </React.Fragment>
    );
};

ClassificationProperty.propTypes = {
    openModal: PropTypes.func,
    tooltip: PropTypes.string,
    value: PropTypes.string,
};

export default ClassificationProperty;
