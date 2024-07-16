import PropTypes from 'prop-types';
import * as React from 'react';

const ItemListLoadingPlaceholder = ({ width = '80%' }) => (
    <div className="item-list-loading-placeholder" style={{ width }} />
);

ItemListLoadingPlaceholder.propTypes = {
    width: PropTypes.string,
};

export default ItemListLoadingPlaceholder;
