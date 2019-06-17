// @flow
import * as React from 'react';
import className from 'classnames';

type Props = {
    item: ?BoxItem,
    onItemSelect: Function,
    slotIndex: number,
    slotRenderer: ?(slotIndex: number) => React.Element<any>,
};

function MDVGridViewSlot({ item, onItemSelect, slotIndex, slotRenderer, ...rest }: Props) {
    // TODO: make classes for bce-grid-item and bce-grid-item-selected,
    // instead of reusing bce-item-row classes
    const slotClassName = className('bce-item-row', {
        'bce-item-row-selected': item ? item.selected : false,
    });

    const onClick = () => {
        console.log('MDVGridViewSlot clicked');
        onItemSelect(item);
    };

    if (!slotRenderer) {
        return <div className="MDVGridViewSlot MDVGridViewSlot-blank" />;
    }

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
        <div className={`MDVGridViewSlot ${slotClassName}`} onClick={onClick} {...rest}>
            {slotRenderer(slotIndex)}
        </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
    /* eslint-enable jsx-a11y/click-events-have-key-events */
}

export default MDVGridViewSlot;
