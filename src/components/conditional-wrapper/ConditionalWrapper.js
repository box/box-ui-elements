// @flow
import * as React from 'react';

/**
 * conditional wrapper will disable the wrapper and only return the children if isDisabled is true
 */
type Props = {
    children: React.Node,
    isDisabled?: boolean,
    wrapper: any,
    wrapperProps?: Object,
};

const ConditionalWrapper = ({ children, isDisabled, wrapper, wrapperProps = {} }: Props) =>
    isDisabled ? children : React.createElement(wrapper, wrapperProps, children);

export default ConditionalWrapper;
