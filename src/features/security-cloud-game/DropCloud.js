import PropTypes from 'prop-types';
import React from 'react';

import Logo from '../../components/logo';
import IconCloud from '../../icons/general/IconCloud';

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

const DropCloud = ({ className, cloudSize = 64, position }) => {
    const { x, y } = position;
    return (
        <div className={`drop-cloud ${className}`} style={{ top: `${y}px`, left: `${x}px` }}>
            <IconCloud
                filter={{ id: 'inset-shadow', definition: <InsetFilter /> }}
                height={cloudSize}
                width={cloudSize}
            />
            <Logo />
        </div>
    );
};

DropCloud.displayName = 'DropCloud';

DropCloud.propTypes = {
    className: PropTypes.string,
    cloudSize: PropTypes.number,
    position: PropTypes.objectOf(PropTypes.number).isRequired,
};

// Actual export
export default DropCloud;
