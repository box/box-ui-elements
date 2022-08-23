import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import AnimateHeight from 'react-animate-height';

// @ts-ignore flow import
import { bdlGray50 } from '../../styles/variables';
import IconChevron, { DirectionType } from '../../icons/general/IconChevron';
import PlainButton from '../plain-button';
import { ButtonType } from '../button';

import './SidebarCollapsible.scss';

type SidebarCollapsibleProps = {
    /** animationDuration - duration of animation in milliseconds */
    animationDuration?: number;
    /** buttonProps - other props (e.g. resin target names) to be included in the button */
    buttonProps?: Record<string, React.ReactNode>;
    /** children - content to be displayed in the card when it is expanded */
    children: Array<React.ReactChild> | React.ReactChild;
    /** className - CSS class for the wrapper div */
    className?: string;
    /** isOpen - initial state of the collapsible card */
    isOpen: boolean;
    /** onClose - callback called when collapsible is opened */
    onClose?: Function;
    /** onOpen - callback called when collapsible is collapsed */
    onOpen?: Function;
    /** title - string or component in the title of the collapsible card */
    title: string | React.ReactElement;
};

type SidebarCollapsibleState = {
    /** isOpen - initial state of the collapsible card */
    isOpen: boolean;
};

const SidebarCollapsible = ({
    animationDuration = 100,
    buttonProps,
    children,
    className,
    isOpen,
    onClose,
    onOpen,
    title,
}: SidebarCollapsibleProps) => {
    const [state, setState] = React.useState<SidebarCollapsibleState>({ isOpen });

    const toggleVisibility = () => {
        if (state.isOpen && onClose) {
            onClose();
        } else if (!state.isOpen && onOpen) {
            onOpen();
        }
        setState({ isOpen: !state.isOpen });
    };

    return (
        <div
            className={classNames('sidebar-collapsible-container', className, {
                'is-open': state.isOpen,
            })}
        >
            <div className="sidebar-collapsible-header">
                <PlainButton
                    aria-expanded={state.isOpen}
                    className="sidebar-collapsible-header-btn"
                    onClick={toggleVisibility}
                    type={ButtonType.BUTTON}
                >
                    <div className="sidebar-collapsible-title">{title}</div>
                    <IconChevron
                        className="sidebar-collapsible-icon"
                        color={bdlGray50}
                        direction={state.isOpen ? DirectionType.DOWN : DirectionType.RIGHT}
                    />
                </PlainButton>
            </div>
            <AnimateHeight duration={animationDuration} height={state.isOpen ? 'auto' : 0}>
                <div className="sidebar-collapsible-dropdown-container">{children}</div>
            </AnimateHeight>
        </div>
    );
};

export { SidebarCollapsibleProps };
export default SidebarCollapsible;
