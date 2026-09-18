import * as React from 'react';
import classNames from 'classnames';

import type { SelectOptionValueProp } from './props';
import type { PopperChildrenProps } from '../popper/props';

export const OVERLAY_SCROLLABLE_CLASS = 'bdl-SelectField-overlay--scrollable';

export interface SelectFieldDropdownProps extends PopperChildrenProps {
    /** Dropdown list content */
    children: React.ReactNode;
    /** Ref forwarded to the dropdown list element */
    innerRef?: React.Ref<HTMLUListElement>;
    /** Whether the dropdown list is scrollable */
    isScrollable?: boolean;
    /** Whether more than one option can be selected */
    multiple?: boolean;
    /** ID applied to the listbox for aria-owns */
    selectFieldID: string;
    /** Currently selected option values */
    selectedValues: Array<SelectOptionValueProp>;
}

class SelectFieldDropdown extends React.Component<SelectFieldDropdownProps> {
    componentDidUpdate({ selectedValues: prevSelectedValues }: SelectFieldDropdownProps) {
        const { multiple, scheduleUpdate, selectedValues } = this.props;
        if (multiple && scheduleUpdate && prevSelectedValues !== selectedValues) {
            scheduleUpdate();
        }
    }

    render() {
        const { children, innerRef, style, placement, isScrollable, multiple, selectFieldID } = this.props;

        const listboxProps: { 'aria-multiselectable'?: boolean } = {};
        if (multiple) {
            listboxProps['aria-multiselectable'] = true;
        }

        return (
            <ul
                ref={innerRef}
                style={style}
                data-placement={placement}
                className={classNames('bdl-SelectFieldDropdown', 'overlay', {
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

export default React.forwardRef<HTMLUListElement, SelectFieldDropdownProps>((props, ref) => (
    <SelectFieldDropdown {...props} innerRef={ref} />
));
