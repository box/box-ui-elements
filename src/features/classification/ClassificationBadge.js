// @deprecated

import React from 'react';
import PropTypes from 'prop-types';

import Badge from '../../components/badge';
import Tooltip from '../../components/tooltip';

import './ClassificationBadge.scss';

const ClassificationBadge = ({ tooltip, tooltipPosition, value }) => {
    const badge = (
        <Badge className="classification-badge" type="warning">
            {value}
        </Badge>
    );

    return tooltip ? (
        <Tooltip position={tooltipPosition} text={tooltip}>
            {badge}
        </Tooltip>
    ) : (
        badge
    );
};

ClassificationBadge.propTypes = {
    tooltip: PropTypes.string,
    tooltipPosition: PropTypes.string,
    value: PropTypes.string.isRequired,
};

export default ClassificationBadge;
