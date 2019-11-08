// @flow
import * as React from 'react';
import classNames from 'classnames';

import type { SelectOptionValueProp } from './props';

export const OVERLAY_SCROLLABLE_CLASS = 'bdl-SelectField-overlay--scrollable';

type Props = {
    children: React.Node,
    isScrollable?: boolean,
    multiple?: boolean,
    placement: string,
    popperRef: (?HTMLElement) => void,
    scheduleUpdate?: () => void,
    selectFieldID: String,
    selectedValues: Array<SelectOptionValueProp>,
    style: Object,
};

class SelectDropdownList extends React.Component<Props> {
    componentDidUpdate({ selectedValues: prevSelectedValues }) {
        const { scheduleUpdate, selectedValues } = this.props;
        if (scheduleUpdate && prevSelectedValues !== selectedValues) {
            scheduleUpdate();
        }
    }

    render() {
        const { children, popperRef, style, placement, isScrollable, multiple, selectFieldID } = this.props;

        const listboxProps = {};
        if (multiple) {
            listboxProps['aria-multiselectable'] = true;
        }

        return (
            <ul
                ref={popperRef}
                style={style}
                data-placement={placement}
                className={classNames('overlay', {
                    [OVERLAY_SCROLLABLE_CLASS]: isScrollable,
                })}
                id={selectFieldID}
                role="listbox"
                // preventDefault on mousedown so blur doesn't happen before click
                onMouseDown={event => event.preventDefault()}
                {...listboxProps}
            >
                {children}
            </ul>
        );
    }
}

export default SelectDropdownList;
