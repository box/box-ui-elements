import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Logo from '../../components/logo';
import IconCloud from '../../icons/general/IconCloud';
import messages from './messages';

const InsetFilter = () => (
    <filter id="inset-shadow">
        <feOffset dx="0" dy="1.5" />
        <feGaussianBlur result="offset-blur" stdDeviation="0.5" />
        <feComposite in="SourceGraphic" in2="offset-blur" operator="out" result="inverse" />
        <feFlood floodColor="black" floodOpacity="1" result="color" />
        <feComposite in="color" in2="inverse" operator="in" result="shadow" />
        <feComposite in="shadow" in2="SourceGraphic" operator="over" />
    </filter>
);

const DropCloud = ({ className, cloudSize, position }) => {
    const { x, y } = position;
    return (
        <div className={classNames('bdl-DropCloud', className)} style={{ top: `${y}px`, left: `${x}px` }}>
            <IconCloud
                filter={{ id: 'inset-shadow', definition: <InsetFilter /> }}
                height={cloudSize}
                title={<FormattedMessage {...messages.target} />}
                width={cloudSize}
            />
            <Logo title="Box" />
        </div>
    );
};

DropCloud.displayName = 'DropCloud';

DropCloud.propTypes = {
    className: PropTypes.string,
    cloudSize: PropTypes.number,
    intl: PropTypes.any,
    position: PropTypes.objectOf(PropTypes.number).isRequired,
};

// Actual export
export default DropCloud;
