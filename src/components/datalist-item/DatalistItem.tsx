import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';

import './DatalistItem.scss';

export interface DatalistItemProps {
    /** Content to render in the list item */
    children: React.ReactNode;

    /** CSS class for the list item */
    className?: string;

    /** Set by a parent datalist component to indicate when the item is highlighted (but not necessarily selected) */
    isActive?: boolean;

    /** Set by a parent datalist component to indicate when the item is selected */
    isSelected?: boolean;

    /** Set by a parent datalist component to receive the updated active item ID */
    setActiveItemID?: (id: string) => void;
}

class DatalistItem extends React.Component<DatalistItemProps> {
    constructor(props: DatalistItemProps) {
        super(props);
        this.id = uniqueId('datalistitem');
    }

    componentDidMount() {
        if (this.props.isActive) {
            this.setActiveItemID();
        }
    }

    componentDidUpdate(prevProps: DatalistItemProps) {
        if (this.props.isActive && !prevProps.isActive) {
            this.setActiveItemID();
        }
    }

    setActiveItemID = () => {
        const { setActiveItemID } = this.props;

        if (setActiveItemID) {
            setActiveItemID(this.id);
        }
    };

    id: string;

    render() {
        const { children, className, isActive, isSelected, ...rest } = this.props;
        const classes = classNames(
            'datalist-item',
            {
                'is-active': isActive,
            },
            className,
        );
        const itemProps = omit(rest, ['closeDropdown', 'setActiveItemID']);

        /* eslint-disable jsx-a11y/role-has-required-aria-props */
        // required aria props are added dynamically
        return (
            <li {...itemProps} className={classes} id={this.id} role="option" aria-selected={isSelected}>
                {children}
            </li>
        );
        /* eslint-enable jsx-a11y/role-has-required-aria-props */
    }
}

export default DatalistItem;
