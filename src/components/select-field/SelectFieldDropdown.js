// @flow
import * as React from 'react';
import classNames from 'classnames';

import type { SelectOptionValueProp } from './props';
import type { PopperChildrenProps } from '../popper/props';

export const OVERLAY_SCROLLABLE_CLASS = 'bdl-SelectField-overlay--scrollable';

type Props = {
    children: React.Node,
    innerRef?: React.Ref<any>,
    isScrollable?: boolean,
    multiple?: boolean,
    selectFieldID: string,
    selectedValues: Array<SelectOptionValueProp>,
} & PopperChildrenProps;

class SelectFieldDropdown extends React.Component<Props> {
    componentDidUpdate({ selectedValues: prevSelectedValues }) {
        const { multiple, scheduleUpdate, selectedValues } = this.props;
        if (multiple && scheduleUpdate && prevSelectedValues !== selectedValues) {
            scheduleUpdate();
        }
    }

    render() {
        const { children, innerRef, style, placement, isScrollable, multiple, selectFieldID } = this.props;

        const listboxProps = {};
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

export default React.forwardRef<Props, HTMLUListElement>((props: Props, ref) => (
    <SelectFieldDropdown {...props} innerRef={ref} />
));
