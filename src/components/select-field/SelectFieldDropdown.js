// @flow
import * as React from 'react';
import classNames from 'classnames';

import type { SelectOptionValueProp } from './props';

export const OVERLAY_SCROLLABLE_CLASS = 'bdl-SelectField-overlay--scrollable';

type Props = {
    children: React.Node,
    innerRef: React.Ref,
    isScrollable?: boolean,
    multiple?: boolean,
    placement?: string,
    scheduleUpdate: () => void,
    selectFieldID: String,
    selectedValues: Array<SelectOptionValueProp>,
    style: Object,
};

class SelectFieldDropdown extends React.Component<Props> {
    componentDidUpdate({ selectedValues: prevSelectedValues }) {
        const { multiple, scheduleUpdate, selectedValues } = this.props;
        if (multiple && prevSelectedValues !== selectedValues) {
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

export default React.forwardRef<Props, React.Ref<any>>((props: Props, ref: React.Ref<any>) => (
    <SelectFieldDropdown {...props} innerRef={ref} />
));
