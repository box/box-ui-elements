import PropTypes from 'prop-types';
import * as React from 'react';

import PlainButton from '../../../components/plain-button';
import IconChevron from '../../../icons/general/IconChevron';

import { ItemTypePropType } from '../prop-types';

import { TYPE_FOLDER } from '../../../constants';

const ITEM_LIST_NAME_CLASS = 'item-list-name';

const ItemListName = ({ itemId = '', type, name, label = '', isSelected = false, onClick, rowIndex, linkRenderer }) => {
    const isFolder = type === TYPE_FOLDER;

    const handleClick = React.useCallback(event => onClick(event, rowIndex), [onClick, rowIndex]);

    const linkProps = {
        className: `lnk ${ITEM_LIST_NAME_CLASS}`,
        onClick: handleClick,
        children: [
            <span key="name">{name}</span>,
            <IconChevron
                color={isSelected ? '#447991' : '#333'}
                direction="right"
                key="icon"
                size="4px"
                thickness="1px"
            />,
        ],
    };
    const renderLink = () => (linkRenderer ? linkRenderer({ ...linkProps, itemId }) : <PlainButton {...linkProps} />);

    return (
        <div className="item-list-name-container">
            {isFolder ? renderLink() : <span className={ITEM_LIST_NAME_CLASS}>{name}</span>}
            {!!label && <span className="item-list-name-label">{label}</span>}
        </div>
    );
};

ItemListName.propTypes = {
    itemId: PropTypes.string,
    type: ItemTypePropType,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    rowIndex: PropTypes.number,
    linkRenderer: PropTypes.func,
};

export default ItemListName;
