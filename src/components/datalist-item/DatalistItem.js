// @flow
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';

import './DatalistItem.scss';

type Props = {
    /** Content to render in the list item */
    children: React.Node,
    /** CSS class for the list item */
    className?: string,
    /** Set by a parent datalist component to indicate when the item is highlighted (but not necessarily selected) */
    isActive?: boolean,
    /** Set by a parent datalist component to receive the updated active item ID */
    setActiveItemID?: Function,
    title?: string,
};

class DatalistItem extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.id = uniqueId('datalistitem');
    }

    componentWillMount() {
        if (this.props.isActive) {
            this.setActiveItemID();
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.isActive && !this.props.isActive) {
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
        const { children, className, isActive, title, ...rest } = this.props;
        const classes = classNames('datalist-item', { 'is-active': isActive }, className);
        const itemProps = omit(rest, ['closeDropdown', 'setActiveItemID']);

        // required aria props are added dynamically
        /* eslint-disable jsx-a11y/role-has-required-aria-props */
        return (
            <li {...itemProps} className={classes} id={this.id} role="option" title={title}>
                {children}
            </li>
        );
        /* eslint-enable jsx-a11y/role-has-required-aria-props */
    }
}

export default DatalistItem;
